// /api/analytics/track/route.ts - FIXED VERSION
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import clientPromise from '../../../../../backend/lib/mongodb';

interface TrackingData {
  page: string;
  totalClicks?: number;
  sessionId?: string;
  isInitialView?: boolean;
  isFirstVisitToPage?: boolean;
}

let ttlIndexCreated = false;

export async function POST(req: NextRequest) {
  try {
    const trackingData: TrackingData = await req.json();

    if (!trackingData.page) {
      return NextResponse.json({ 
        message: 'Page is required' 
      }, { status: 400 });
    }

    //Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('Webdev');
    const pageStats = db.collection('page_stats');
    const uniqueVisitors = db.collection('unique_visitors');

    //Create TTL index on first run (expires documents after 1 hour)
    if (!ttlIndexCreated) {
      try {
        await uniqueVisitors.createIndex(
          { "lastVisit": 1 }, 
          { 
            expireAfterSeconds: 3600, // 1 hour in seconds
            name: "ttl_lastVisit_1h"
          }
        );
        ttlIndexCreated = true;
      } catch (error) {
        console.log('TTL index creation note:', error);
      }
    }

    //Check if user is authenticated
    let isRegistered = false;
    let userId = null;
    const token = req.cookies.get('token')?.value;
    
    if (token && process.env.JWT_SECRET) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: string };
        userId = decoded.userId;
        isRegistered = true;
      } catch (error) {
        // User not authenticated, continue as anonymous
      }
    }

    const sessionId = trackingData.sessionId || 'unknown';
    const visitorKey = isRegistered ? `user_${userId}` : `session_${sessionId}`;
    
    let shouldCountAsUniqueVisitor = false;
    
    // ONLY count as unique visitor if:
    // 1. This is an initial view (not a click update)
    // 2. This is their first visit to this specific page in this session
    // 3. They haven't visited ANY page in the last hour (TTL period)
    if (trackingData.isInitialView && trackingData.isFirstVisitToPage) {
      const hasVisitedAnyPageRecently = await uniqueVisitors.findOne({
        visitorKey: visitorKey,
        lastVisit: { $gte: new Date(Date.now() - 3600000) } // 1 hour ago
      });
      
      if (!hasVisitedAnyPageRecently) {
        shouldCountAsUniqueVisitor = true;
        
        //Record this visitor visit
        await uniqueVisitors.insertOne({
          page: trackingData.page,
          visitorKey: visitorKey,
          isRegistered: isRegistered,
          userId: userId,
          sessionId: sessionId,
          lastVisit: new Date()
        });
      } else {
        //Update the lastVisit time to reset TTL countdown
        await uniqueVisitors.updateOne(
          { visitorKey: visitorKey },
          { 
            $set: { 
              lastVisit: new Date(),
              page: trackingData.page //Update current page
            } 
          }
        );
      }
    }

    // Build the update query
    let updateData: any;

    if (trackingData.isInitialView) {
      // This is an initial page view  increment views and potentially unique users
      updateData = {
        $set: {
          lastUpdated: new Date()
        },
        $setOnInsert: {
          page: trackingData.page,
          createdAt: new Date()
        },
        $inc: {
          totalViews: 1,
          totalClicks: trackingData.totalClicks || 0,
          // Only count unique users for actual unique visitors
          registeredUsers: (shouldCountAsUniqueVisitor && isRegistered) ? 1 : 0,
          anonymousUsers: (shouldCountAsUniqueVisitor && !isRegistered) ? 1 : 0
        }
      };
    } else {
      //This is just a click update  only increment clicks
      updateData = {
        $set: {
          lastUpdated: new Date()
        },
        $setOnInsert: {
          page: trackingData.page,
          createdAt: new Date(),
          totalViews: 0,
          registeredUsers: 0,
          anonymousUsers: 0
        },
        $inc: {
          totalClicks: trackingData.totalClicks || 0
        }
      };
    }

    await pageStats.updateOne(
      { page: trackingData.page },
      updateData,
      { upsert: true }
    );

    return NextResponse.json({
      message: 'Page stats updated successfully',
      debug: {
        shouldCountAsUniqueVisitor,
        isRegistered,
        isInitialView: trackingData.isInitialView,
        isFirstVisitToPage: trackingData.isFirstVisitToPage,
        visitorKey: visitorKey.substring(0, 20) + '...'
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Error updating page stats:', error);
    return NextResponse.json({ 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}