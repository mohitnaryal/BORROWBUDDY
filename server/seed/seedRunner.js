const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Item = require('../models/Item');
const BorrowRequest = require('../models/BorrowRequest');
const Transaction = require('../models/Transaction');
const Review = require('../models/Review');

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/borrowbuddy';
  await mongoose.connect(mongoURI);
  console.log('[Seed DB] Connected to MongoDB');
};

const runSeed = async () => {
  try {
    await connectDB();

    console.log('Clearing existing database collections...');
    await Promise.all([
      User.deleteMany({}),
      Item.deleteMany({}),
      BorrowRequest.deleteMany({}),
      Transaction.deleteMany({}),
      Review.deleteMany({}),
    ]);

    console.log('Seeding demo users...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const usersData = [
      {
        name: 'Aarav Sharma',
        email: 'aarav@borrowbuddy.com',
        password: hashedPassword,
        phone: '+91 98765 43210',
        city: 'Phagwara',
        locality: 'Law Gate / GT Road',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
        bio: 'Mechanical engineering student & DIY enthusiast. Believe in shared ownership for heavy tools and electronics.',
        rating: 4.9,
        totalReviews: 8,
        role: 'user',
      },
      {
        name: 'Priya Patel',
        email: 'priya@borrowbuddy.com',
        password: hashedPassword,
        phone: '+91 98234 56789',
        city: 'Jalandhar',
        locality: 'Model Town',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
        bio: 'Community organizer & home baker. Happy to lend kitchen gadgets, pressure washers, and party supplies.',
        rating: 5.0,
        totalReviews: 6,
        role: 'user',
      },
      {
        name: 'Rohan Verma',
        email: 'rohan@borrowbuddy.com',
        password: hashedPassword,
        phone: '+91 97123 45678',
        city: 'Chandigarh',
        locality: 'Sector 17 & PU Campus',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&q=80',
        bio: 'Freelance filmmaker & software developer. Lending projectors, tripods, ergonomic study furniture, and tech gadgets.',
        rating: 4.8,
        totalReviews: 5,
        role: 'user',
      },
      {
        name: 'Simran Kaur',
        email: 'simran@borrowbuddy.com',
        password: hashedPassword,
        phone: '+91 98888 77766',
        city: 'Ludhiana',
        locality: 'Sarabha Nagar',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
        bio: 'State-level badminton player & outdoor fitness coach. Sharing sports rackets, cycle pumps, and fitness gear.',
        rating: 4.9,
        totalReviews: 4,
        role: 'user',
      },
      {
        name: 'Vikram Thakur',
        email: 'vikram@borrowbuddy.com',
        password: hashedPassword,
        phone: '+91 94180 12345',
        city: 'Kangra',
        locality: 'Dharamshala Road',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        bio: 'Trekking enthusiast & avid reader. Renting out high-altitude camping tents, sleeping bags, and book box sets.',
        rating: 5.0,
        totalReviews: 7,
        role: 'user',
      },
    ];

    const seededUsers = await User.insertMany(usersData);
    const [aarav, priya, rohan, simran, vikram] = seededUsers;

    console.log('Seeding 12 sample items across diverse categories and locations...');
    const itemsData = [
      {
        title: 'Bosch GSB 500W Cordless Impact Drill & 100-Piece Bit Kit',
        description:
          'Heavy duty 500W impact drill machine ideal for masonry, wood, and metal drilling. Comes with complete 100-piece accessory kit, wall anchors, and sturdy carry case. Perfect for mounting shelving, wall art, and home repairs.',
        category: 'Tools',
        condition: 'Like New',
        images: [
          'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80',
        ],
        owner: aarav._id,
        city: 'Phagwara',
        locality: 'Law Gate / GT Road',
        pricePerDay: 50,
        securityDeposit: 200,
        borrowingRules:
          'Please ensure all drill bits are wiped clean and placed back in their marked slots after use. Handle cord and chuck carefully.',
        isAvailable: true,
        totalBorrows: 4,
        damageReportsCount: 0,
      },
      {
        title: 'Sony Full HD Portable Home Projector (3200 Lumens, HDMI)',
        description:
          'Crisp 1080p native projector with 3200 ANSI lumens brightness. Connects seamlessly with laptops, Fire TV stick, Chromecast, and gaming consoles via HDMI. Ideal for movie nights, hostel watch-parties, and presentations.',
        category: 'Electronics',
        condition: 'Good',
        images: [
          'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80',
        ],
        owner: rohan._id,
        city: 'Chandigarh',
        locality: 'Sector 17',
        pricePerDay: 150,
        securityDeposit: 500,
        borrowingRules:
          'Strictly keep in dust-free environment. Do not turn off directly from mains; use the remote so cooling fan runs.',
        isAvailable: true,
        totalBorrows: 5,
        damageReportsCount: 0,
      },
      {
        title: 'Quechua 4-Person Waterproof Camping Tent & Ground Mat',
        description:
          'Spacious waterproof pop-up dome tent suitable for up to 4 adults. Wind-tested up to 50 km/h with fresh & black fabric for dark, cool sleep. Includes insulated aluminum ground foil, carry bag, and ground stakes.',
        category: 'Travel & Camping',
        condition: 'Like New',
        images: [
          'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=800&q=80',
        ],
        owner: vikram._id,
        city: 'Kangra',
        locality: 'Dharamshala Road',
        pricePerDay: 120,
        securityDeposit: 400,
        borrowingRules:
          'Must be completely dried before packing back into the bag. Ensure all 12 metal pegs are returned.',
        isAvailable: true,
        totalBorrows: 6,
        damageReportsCount: 0,
      },
      {
        title: 'Yonex Astrox 88D Pro Badminton Rackets (Pair with 3 Shuttles)',
        description:
          'Matched pair of graphite Yonex tournament-grade badminton rackets with BG65 strings at 26 lbs tension. Includes padded full-length thermo bag and a fresh tube of Yonex Mavis 350 nylon shuttlecocks.',
        category: 'Sports',
        condition: 'Good',
        images: [
          'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80',
        ],
        owner: simran._id,
        city: 'Ludhiana',
        locality: 'Sarabha Nagar',
        pricePerDay: 40,
        securityDeposit: 150,
        borrowingRules:
          'Please do not clash rackets on hard surfaces or play on abrasive tarmac.',
        isAvailable: true,
        totalBorrows: 3,
        damageReportsCount: 0,
      },
      {
        title: 'Canon EOS 1500D DSLR Camera with 18-55mm Lens & Tripod',
        description:
          '24.1 Megapixel CMOS sensor DSLR with built-in Wi-Fi & NFC. Comes with EF-S 18-55mm IS II zoom lens, 64GB high speed SD card, two LP-E10 batteries, wall charger, lens hood, and a lightweight aluminum tripod.',
        category: 'Electronics',
        condition: 'Like New',
        images: [
          'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
        ],
        owner: aarav._id,
        city: 'Phagwara',
        locality: 'Law Gate / GT Road',
        pricePerDay: 200,
        securityDeposit: 800,
        borrowingRules:
          'Always keep neck strap secured while operating. Avoid exposing camera body or lens to heavy rain or sand.',
        isAvailable: true,
        totalBorrows: 5,
        damageReportsCount: 0,
      },
      {
        title: 'Harry Potter Deluxe 7-Book Box Set (Hardcover Bloomsbury Edition)',
        description:
          'The complete collection of J.K. Rowling’s classic fantasy series in pristine hardback editions with original cover artwork. Perfect for a nostalgic weekend binge or young readers discovering Hogwarts for the first time.',
        category: 'Books',
        condition: 'New',
        images: [
          'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80',
        ],
        owner: vikram._id,
        city: 'Kangra',
        locality: 'Dharamshala Road',
        pricePerDay: 0, // Free community borrow!
        securityDeposit: 0,
        borrowingRules:
          'Free to borrow! Please use the included bookmarks; do not dog-ear the pages or highlight text.',
        isAvailable: true,
        totalBorrows: 7,
        damageReportsCount: 0,
      },
      {
        title: 'Karcher K2 Universal Pressure Washer 110 Bar with Dirt Blaster',
        description:
          'German engineered 110-bar pressure washer with high-pressure hose and quick-connect spray gun. Effortlessly cleans cars, motorbikes, balconies, pavers, and terrace grime using 80% less water than a normal hose.',
        category: 'Tools',
        condition: 'Good',
        images: [
          'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80',
        ],
        owner: priya._id,
        city: 'Jalandhar',
        locality: 'Model Town',
        pricePerDay: 80,
        securityDeposit: 300,
        borrowingRules:
          'Ensure continuous water flow is turned ON before powering on motor to prevent pump cavitation.',
        isAvailable: true,
        totalBorrows: 4,
        damageReportsCount: 0,
      },
      {
        title: 'Philips Digital Air Fryer 4.1L (Rapid Air Technology)',
        description:
          'Healthy cooking appliance with 90% less oil. Great for samosas, fries, roasted veggies, grilled chicken, and reheat tasks in PG or hostel rooms with power backup. Non-stick easy wash basket.',
        category: 'Kitchen',
        condition: 'Like New',
        images: [
          'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=800&q=80',
        ],
        owner: priya._id,
        city: 'Jalandhar',
        locality: 'Model Town',
        pricePerDay: 60,
        securityDeposit: 200,
        borrowingRules:
          'Use wooden or silicone spatulas only to prevent scratching Teflon coating. Wash basket with soft sponge.',
        isAvailable: true,
        totalBorrows: 4,
        damageReportsCount: 0,
      },
      {
        title: 'Foldable Aluminium 6-Step Ladder with Anti-Slip Rungs (150kg)',
        description:
          'Sturdy rust-proof aircraft-grade aluminium step ladder. Lightweight (under 5 kg) but holds up to 150 kg load. Folds flat to just 2 inches for easy boot transport or narrow storage. Perfect for ceiling painting or fan cleaning.',
        category: 'Tools',
        condition: 'Good',
        images: [
          'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
        ],
        owner: aarav._id,
        city: 'Phagwara',
        locality: 'Law Gate / GT Road',
        pricePerDay: 0, // Free community borrow!
        securityDeposit: 0,
        borrowingRules:
          'Ensure safety latch is locked before ascending. Return folded and wiped clean.',
        isAvailable: true,
        totalBorrows: 8,
        damageReportsCount: 0,
      },
      {
        title: 'Trek Marlin 5 Mountain Bicycle (21-Speed, Front Suspension)',
        description:
          'Trail-worthy daily commuter bike with hydraulic disc brakes, SR Suntour suspension fork, and 29-inch double-walled rims. Comes with frame lock, bright front LED headlight, and mini hand pump.',
        category: 'Sports',
        condition: 'Like New',
        images: [
          'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80',
        ],
        owner: simran._id,
        city: 'Ludhiana',
        locality: 'Sarabha Nagar',
        pricePerDay: 90,
        securityDeposit: 300,
        borrowingRules:
          'Lock bike to fixed anchor when unattended. Helmet provided and required.',
        isAvailable: true,
        totalBorrows: 5,
        damageReportsCount: 0,
      },
      {
        title: 'Ergonomic Mesh Study Chair with Dynamic Lumbar Support',
        description:
          'Breathable Korean mesh high-back office chair with 3D adjustable armrests, pneumatic height adjustment, and 120-degree tilt lock. Ideal for exam preparation months or remote internship sprints.',
        category: 'Furniture',
        condition: 'Good',
        images: [
          'https://images.unsplash.com/photo-1580481077194-03a89a05b38f?auto=format&fit=crop&w=800&q=80',
        ],
        owner: rohan._id,
        city: 'Chandigarh',
        locality: 'Sector 17',
        pricePerDay: 30,
        securityDeposit: 100,
        borrowingRules:
          'Keep dry. Castors roll smoothly on tiles or mats; avoid coarse outdoor gravel.',
        isAvailable: true,
        totalBorrows: 3,
        damageReportsCount: 0,
      },
      {
        title: 'Wildcraft 65L Rucksack Trekking Backpack with Rain Cover',
        description:
          'Top-loading rugged 65-litre ergonomic expedition rucksack. Features internal frame aluminum stays, padded hip belt, trekking pole loops, and integrated neon rain poncho. Ideal for Triund or Kheerganga treks.',
        category: 'Travel & Camping',
        condition: 'Like New',
        images: [
          'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80',
        ],
        owner: vikram._id,
        city: 'Kangra',
        locality: 'Dharamshala Road',
        pricePerDay: 50,
        securityDeposit: 150,
        borrowingRules:
          'Empty all compartments and shake out trail dust before returning.',
        isAvailable: true,
        totalBorrows: 5,
        damageReportsCount: 0,
      },
    ];

    const seededItems = await Item.insertMany(itemsData);

    console.log('Seeding sample completed transactions and reviews...');
    // Create 3 verified completed transactions with reviews to establish Borrowing Passports and trust metrics
    const [drill, projector, tent, rackets, camera, books] = seededItems;

    // Tx 1: Priya borrowed Drill from Aarav (Completed)
    const req1 = await BorrowRequest.create({
      item: drill._id,
      borrower: priya._id,
      owner: aarav._id,
      startDate: new Date(Date.now() - 15 * 86400000),
      endDate: new Date(Date.now() - 12 * 86400000),
      totalDays: 4,
      estimatedPrice: 200,
      message: 'Need to drill curtain rods in my new flat in Jalandhar.',
      status: 'Approved',
    });

    const tx1 = await Transaction.create({
      request: req1._id,
      item: drill._id,
      borrower: priya._id,
      owner: aarav._id,
      startDate: req1.startDate,
      endDate: req1.endDate,
      status: 'Completed',
      handoverDate: req1.startDate,
      handoverConfirmedByOwner: true,
      handoverConfirmedByBorrower: true,
      actualReturnDate: req1.endDate,
      returnConfirmedByOwner: true,
      isReturnedOnTime: true,
      damageReported: false,
    });

    // Reviews for Tx 1
    await Review.create({
      transaction: tx1._id,
      item: drill._id,
      reviewer: priya._id,
      reviewee: aarav._id,
      role: 'borrower_to_owner',
      rating: 5,
      comment:
        'Aarav is an awesome lender! The drill worked like a charm and he even provided extra concrete wall plugs.',
      tags: ['Helpful Owner', 'Well Maintained Tool', 'Smooth Handover'],
    });

    await Review.create({
      transaction: tx1._id,
      item: drill._id,
      reviewer: aarav._id,
      reviewee: priya._id,
      role: 'owner_to_borrower',
      rating: 5,
      comment:
        'Priya returned the drill machine spotless and ahead of schedule. Highly recommended borrower!',
      tags: ['Punctual', 'Respectful of Items', 'Great Communication'],
    });

    // Tx 2: Simran borrowed Tent from Vikram (Completed)
    const req2 = await BorrowRequest.create({
      item: tent._id,
      borrower: simran._id,
      owner: vikram._id,
      startDate: new Date(Date.now() - 25 * 86400000),
      endDate: new Date(Date.now() - 22 * 86400000),
      totalDays: 4,
      estimatedPrice: 480,
      message: 'Going on a 3-day trek to Triund with college friends.',
      status: 'Approved',
    });

    const tx2 = await Transaction.create({
      request: req2._id,
      item: tent._id,
      borrower: simran._id,
      owner: vikram._id,
      startDate: req2.startDate,
      endDate: req2.endDate,
      status: 'Completed',
      handoverDate: req2.startDate,
      handoverConfirmedByOwner: true,
      handoverConfirmedByBorrower: true,
      actualReturnDate: req2.endDate,
      returnConfirmedByOwner: true,
      isReturnedOnTime: true,
      damageReported: false,
    });

    await Review.create({
      transaction: tx2._id,
      item: tent._id,
      reviewer: simran._id,
      reviewee: vikram._id,
      role: 'borrower_to_owner',
      rating: 5,
      comment:
        'The Quechua tent held up through rain at night without a single drop entering. Vikram also gave great local trail tips!',
      tags: ['Trail Tested', 'Clean Gear', 'Super Friendly'],
    });

    // Tx 3: Aarav borrowed Projector from Rohan (Completed)
    const req3 = await BorrowRequest.create({
      item: projector._id,
      borrower: aarav._id,
      owner: rohan._id,
      startDate: new Date(Date.now() - 8 * 86400000),
      endDate: new Date(Date.now() - 6 * 86400000),
      totalDays: 3,
      estimatedPrice: 450,
      message: 'Hostel cricket final match screening on our common room wall!',
      status: 'Approved',
    });

    const tx3 = await Transaction.create({
      request: req3._id,
      item: projector._id,
      borrower: aarav._id,
      owner: rohan._id,
      startDate: req3.startDate,
      endDate: req3.endDate,
      status: 'Completed',
      handoverDate: req3.startDate,
      handoverConfirmedByOwner: true,
      handoverConfirmedByBorrower: true,
      actualReturnDate: req3.endDate,
      returnConfirmedByOwner: true,
      isReturnedOnTime: true,
      damageReported: false,
    });

    await Review.create({
      transaction: tx3._id,
      item: projector._id,
      reviewer: aarav._id,
      reviewee: rohan._id,
      role: 'borrower_to_owner',
      rating: 5,
      comment:
        'Picture quality on 1080p was razor sharp. Super easy pickup in Sector 17.',
      tags: ['Crisp Quality', 'Easy Pickup', 'Five Stars'],
    });

    // Active Pending Request (Simran requesting Canon Camera from Aarav)
    await BorrowRequest.create({
      item: camera._id,
      borrower: simran._id,
      owner: aarav._id,
      startDate: new Date(Date.now() + 2 * 86400000),
      endDate: new Date(Date.now() + 5 * 86400000),
      totalDays: 4,
      estimatedPrice: 800,
      message:
        'Hi Aarav, our college sports annual meet is this weekend. Would love to borrow your Canon DSLR for track photos!',
      status: 'Pending',
    });

    // Active Borrowed Transaction (Vikram borrowed Books from Rohan)
    const activeReq = await BorrowRequest.create({
      item: books._id,
      borrower: priya._id,
      owner: vikram._id,
      startDate: new Date(Date.now() - 2 * 86400000),
      endDate: new Date(Date.now() + 4 * 86400000),
      totalDays: 7,
      estimatedPrice: 0,
      message:
        'Reading Harry Potter with my nephew visiting for autumn vacation.',
      status: 'Approved',
    });

    await Transaction.create({
      request: activeReq._id,
      item: books._id,
      borrower: priya._id,
      owner: vikram._id,
      startDate: activeReq.startDate,
      endDate: activeReq.endDate,
      status: 'Borrowed',
      handoverDate: activeReq.startDate,
      handoverConfirmedByOwner: true,
      handoverConfirmedByBorrower: true,
    });

    console.log('✅ Database seeded successfully with realistic data!');
    console.log('Demo Credentials:');
    usersData.forEach((u) => {
      console.log(`- ${u.name} (${u.city}): ${u.email} / password123`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

runSeed();
