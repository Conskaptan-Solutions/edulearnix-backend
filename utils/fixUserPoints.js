import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Job from '../models/Job.js';
import Resource from '../models/Resource.js';
import Blog from '../models/Blog.js';
import DigitalProduct from '../models/DigitalProduct.js';

dotenv.config();

const fixUserPoints = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    // Get all users except super_admin
    const users = await User.find({ role: { $ne: 'super_admin' } });
    console.log(`\n📊 Found ${users.length} users to update\n`);

    for (const user of users) {
      // Count all posts by this user
      const jobCount = await Job.countDocuments({ postedBy: user._id });
      const resourceCount = await Resource.countDocuments({ postedBy: user._id });
      const blogCount = await Blog.countDocuments({ author: user._id });
      const productCount = await DigitalProduct.countDocuments({ postedBy: user._id });

      const totalPosts = jobCount + resourceCount + blogCount + productCount;
      
      // Update user's points to match their total posts
      if (totalPosts > 0 || user.points !== totalPosts) {
        await User.findByIdAndUpdate(user._id, { points: totalPosts });
        console.log(`✅ ${user.name} (${user.email})`);
        console.log(`   Posts: ${totalPosts} (Jobs: ${jobCount}, Resources: ${resourceCount}, Blogs: ${blogCount}, Products: ${productCount})`);
        console.log(`   Points: ${user.points} → ${totalPosts}\n`);
      }
    }

    console.log('✅ All user points updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

fixUserPoints();
