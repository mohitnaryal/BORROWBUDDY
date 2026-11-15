// Comprehensive End-to-End Workflow Test for BorrowBuddy
const API = 'http://localhost:5000/api';

async function runE2ETests() {
  console.log('🚀 STARTING COMPREHENSIVE E2E WORKFLOW TESTS...');

  try {
    // Step 1: Register a new Borrower
    const rand = Math.floor(1000 + Math.random() * 9000);
    const regPayload = {
      name: `Kavya Patel ${rand}`,
      email: `kavya${rand}@borrowbuddy.com`,
      password: 'password123',
      confirmPassword: 'password123',
      phone: '+91 99887 66554',
      city: 'Phagwara',
      locality: 'Hostel Block 2 / GT Road',
    };

    console.log('\n1. Registering new borrower user...');
    const regRes = await (await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(regPayload),
    })).json();

    if (!regRes.success) throw new Error(`Registration failed: ${regRes.message}`);
    const borrowerToken = regRes.token;
    const borrowerId = regRes.user._id;
    console.log(`✅ Registered borrower: ${regRes.user.name} (ID: ${borrowerId})`);

    // Step 2: Login as existing Owner (Aarav)
    console.log('\n2. Logging in as item owner Aarav...');
    const ownerLoginRes = await (await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'aarav@borrowbuddy.com', password: 'password123' }),
    })).json();

    if (!ownerLoginRes.success) throw new Error(`Owner login failed: ${ownerLoginRes.message}`);
    const ownerToken = ownerLoginRes.token;
    const ownerId = ownerLoginRes.user._id;
    console.log(`✅ Owner logged in: ${ownerLoginRes.user.name}`);

    // Step 3: Owner creates a new test item (e.g. Electric Lawn Mower)
    console.log('\n3. Owner listing a new item...');
    const createItemRes = await (await fetch(`${API}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ownerToken}`,
      },
      body: JSON.stringify({
        title: `Black+Decker Electric Lawn Mower 1200W ${rand}`,
        description: 'High torque electric lawn mower with 30L grass box. Easy push button start.',
        category: 'Tools',
        condition: 'Like New',
        city: 'Phagwara',
        locality: 'Law Gate',
        pricePerDay: 70,
        securityDeposit: 300,
        borrowingRules: 'Clean blades before returning. Extension cord included.',
        images: ['https://images.unsplash.com/photo-1592417817098-8f3d6ef23963?auto=format&fit=crop&w=800&q=80'],
      }),
    })).json();

    if (!createItemRes.success) throw new Error(`Create item failed: ${createItemRes.message}`);
    const testItemId = createItemRes.item._id;
    console.log(`✅ Item created: "${createItemRes.item.title}" (ID: ${testItemId})`);

    // Step 4: Owner edits the item
    console.log('\n4. Owner editing item price and details...');
    const editRes = await (await fetch(`${API}/items/${testItemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ownerToken}`,
      },
      body: JSON.stringify({
        pricePerDay: 75,
        borrowingRules: 'Clean blades before returning. Heavy-duty 15m extension cord included.',
      }),
    })).json();

    if (!editRes.success) throw new Error(`Edit item failed: ${editRes.message}`);
    console.log(`✅ Item updated price: ₹${editRes.item.pricePerDay}/day`);

    // Step 5: Borrower submits a Borrow Request
    console.log('\n5. Borrower requesting to borrow item for next week...');
    const startDate = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
    const endDate = new Date(Date.now() + 9 * 86400000).toISOString().split('T')[0];

    const reqRes = await (await fetch(`${API}/requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${borrowerToken}`,
      },
      body: JSON.stringify({
        itemId: testItemId,
        startDate,
        endDate,
        message: 'Need to trim the front lawn garden of our student rented villa before landlord inspection!',
      }),
    })).json();

    if (!reqRes.success) throw new Error(`Borrow request failed: ${reqRes.message}`);
    const requestId = reqRes.request._id;
    console.log(`✅ Request submitted: Status=${reqRes.request.status}, Days=${reqRes.request.totalDays}, EstimatedPrice=₹${reqRes.request.estimatedPrice}`);

    // Step 6: Owner approves the request (Creates active Transaction)
    console.log('\n6. Owner approving the borrow request...');
    const approveRes = await (await fetch(`${API}/requests/${requestId}/approve`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ownerToken}`,
      },
    })).json();

    if (!approveRes.success) throw new Error(`Approval failed: ${approveRes.message}`);
    const transactionId = approveRes.transaction._id;
    console.log(`✅ Request Approved! Active Transaction created (ID: ${transactionId}, Status: ${approveRes.transaction.status})`);

    // Step 7: Confirm Handover
    console.log('\n7. Confirming item physical handover...');
    const handoverRes = await (await fetch(`${API}/transactions/${transactionId}/handover`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ownerToken}`,
      },
    })).json();

    if (!handoverRes.success) throw new Error(`Handover confirmation failed: ${handoverRes.message}`);
    console.log(`✅ Handover confirmed! Transaction status: ${handoverRes.transaction.status}`);

    // Step 8: Borrower signals Return
    console.log('\n8. Borrower requesting return...');
    const returnReqRes = await (await fetch(`${API}/transactions/${transactionId}/return`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${borrowerToken}`,
      },
    })).json();

    if (!returnReqRes.success) throw new Error(`Return request failed: ${returnReqRes.message}`);
    console.log(`✅ Return signaled by borrower! Status: ${returnReqRes.transaction.status}`);

    // Step 9: Owner confirms Return (Completes transaction, checks damages)
    console.log('\n9. Owner confirming return and verifying pristine condition...');
    const confirmReturnRes = await (await fetch(`${API}/transactions/${transactionId}/confirm-return`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ownerToken}`,
      },
      body: JSON.stringify({
        damageReported: false,
      }),
    })).json();

    if (!confirmReturnRes.success) throw new Error(`Confirm return failed: ${confirmReturnRes.message}`);
    console.log(`✅ Return confirmed! Transaction status: ${confirmReturnRes.transaction.status}, OnTime: ${confirmReturnRes.transaction.isReturnedOnTime}`);

    // Step 10: Two-way Reviews
    console.log('\n10. Submitting two-way reviews between borrower and owner...');
    // Borrower rates Owner
    const borrowerReviewRes = await (await fetch(`${API}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${borrowerToken}`,
      },
      body: JSON.stringify({
        transactionId,
        rating: 5,
        comment: 'Aarav provided the mower with extension cord and safety earplugs. Great lender!',
        tags: ['Helpful Owner', 'Punctual Handover', 'Item in Mint Condition'],
      }),
    })).json();

    if (!borrowerReviewRes.success) throw new Error(`Borrower review failed: ${borrowerReviewRes.message}`);
    console.log(`✅ Borrower review submitted (Rating: 5/5)`);

    // Owner rates Borrower
    const ownerReviewRes = await (await fetch(`${API}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ownerToken}`,
      },
      body: JSON.stringify({
        transactionId,
        rating: 5,
        comment: 'Kavya cleaned the grass box thoroughly and returned on time. Wonderful borrower!',
        tags: ['On-Time Return', 'Clean & Well Maintained', 'Super Friendly Communication'],
      }),
    })).json();

    if (!ownerReviewRes.success) throw new Error(`Owner review failed: ${ownerReviewRes.message}`);
    console.log(`✅ Owner review submitted (Rating: 5/5)`);

    // Step 11: Inspect Borrowing Passport
    console.log('\n11. Querying updated Borrowing Passport for the item...');
    const passportRes = await (await fetch(`${API}/items/${testItemId}/passport`)).json();
    if (!passportRes.success) throw new Error(`Passport fetch failed: ${passportRes.message}`);
    console.log('✅ Borrowing Passport Ledger Summary:', {
      totalBorrows: passportRes.passport.metrics.totalBorrows,
      onTimeRate: `${passportRes.passport.metrics.onTimeRate}%`,
      damageReports: passportRes.passport.metrics.damageReportsCount,
      trustScore: passportRes.passport.metrics.trustScore,
      seal: passportRes.passport.metrics.verificationSeal,
      reviewsCount: passportRes.passport.reviews.length,
    });

    console.log('\n🎉 ALL 11 END-TO-END WORKFLOW STAGES EXECUTED AND PASSED WITH 100% SUCCESS!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ E2E TEST FAILED:', error);
    process.exit(1);
  }
}

runE2ETests();
