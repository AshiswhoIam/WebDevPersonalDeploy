//webdevtypescript\src\app\api\analytics\pages\route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import clientPromise from '../../../../../backend/lib/mongodb';

//Helper function to verify admin token
const verifyAdminToken = async (request: NextRequest) => {
  const token = request.cookies.get('token')?.value;
  if (!token || !process.env.JWT_SECRET) return null;
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: string };
    
    const client = await clientPromise;
    const users = client.db('Webdev').collection('info');
    const user = await users.findOne({ _id: new ObjectId(decoded.userId) });
    
    if (user && user.role === 'admin' && user.isActive !== false) {
      return user;
    }
    return null;
  } catch {
    return null;
  }
};

export async function GET(req: NextRequest) {
  try {
    //Verify admin access
    const adminUser = await verifyAdminToken(req);
    if (!adminUser) {
      return NextResponse.json({ 
        message: 'Access denied. Admin privileges required.' 
      }, { status: 403 });
    }

    //Get query parameters
    const { searchParams } = new URL(req.url);
    const timeRange = searchParams.get('range') || '7d';
    const page = searchParams.get('page') || '';
    
    //Calculate date range
    const now = new Date();
    let startDate: Date;
    
    switch (timeRange) {
      case '1d':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    //Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('Webdev');
    const analytics = db.collection('analytics');

    //Build match criteria
    const matchCriteria: any = {
      timestamp: { $gte: startDate, $lte: now }
    };

    if (page) {
      matchCriteria.page = new RegExp(page, 'i');
    }

    //Get detailed page analytics
    const pageAnalytics = await analytics.aggregate([
      { $match: matchCriteria },
      {
        $group: {
          _id: '$page',
          views: { $sum: 1 },
          uniqueVisitors: { $addToSet: { $ifNull: ['$userId', '$sessionId'] } },
          totalTime: { $sum: { $ifNull: ['$timeOnPage', 0] } },
          totalClicks: { $sum: { $ifNull: ['$totalClicks', 0] } },
          bounces: {
            $sum: {
              $cond: [
                { 
                  $or: [
                    { $lt: ['$timeOnPage', 30000] }, 
                    { $eq: ['$totalClicks', 0] }
                  ] 
                },
                1,
                0
              ]
            }
          },
          devices: { $addToSet: '$userAgent' },
          referrers: { $addToSet: '$referrer' }
        }
      },
      {
        $project: {
          page: '$_id',
          views: 1,
          uniqueVisitors: { $size: '$uniqueVisitors' },
          avgTimeSpent: {
            $cond: [
              { $gt: ['$views', 0] },
              { $divide: ['$totalTime', '$views'] },
              0
            ]
          },
          avgClicks: {
            $cond: [
              { $gt: ['$views', 0] },
              { $divide: ['$totalClicks', '$views'] },
              0
            ]
          },
          bounceRate: {
            $cond: [
              { $gt: ['$views', 0] },
              { $multiply: [{ $divide: ['$bounces', '$views'] }, 100] },
              0
            ]
          },
          deviceCount: { $size: '$devices' },
          referrerCount: { $size: '$referrers' }
        }
      },
      { $sort: { views: -1 } }
    ]).toArray();

    //Format the results
    const formattedResults = pageAnalytics.map(item => ({
      id: item._id,
      page: item.page,
      views: item.views,
      uniqueVisitors: item.uniqueVisitors,
      avgTimeSpent: formatDuration(item.avgTimeSpent),
      avgClicks: Math.round(item.avgClicks * 10) / 10,
      bounceRate: `${Math.round(item.bounceRate)}%`,
      deviceVariety: item.deviceCount,
      referrerVariety: item.referrerCount
    }));

    return NextResponse.json({
      pages: formattedResults,
      totalPages: formattedResults.length
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching page analytics:', error);
    return NextResponse.json({ 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}

//Helper function to format duration
function formatDuration(ms: number): string {
  if (!ms || ms < 1000) return '0s';
  
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    return `${seconds}s`;
  }
}