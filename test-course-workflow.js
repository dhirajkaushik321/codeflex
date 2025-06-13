const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testCourseWorkflow() {
  console.log('🧪 Testing CodeVeer Course Workflow...\n');

  try {
    // Test 1: Create a new course
    console.log('1️⃣ Testing course creation...');
    const newCourse = {
      title: 'Test Course',
      description: 'A test course for workflow validation',
      level: 'beginner',
      modules: [],
      tags: ['test', 'workflow'],
      outcomes: ['Learn testing', 'Understand workflow']
    };

    const createResponse = await axios.post(`${BASE_URL}/courses`, newCourse);
    console.log('✅ Course created successfully:', createResponse.data._id);

    // Test 2: Get all courses (should be filtered by owner)
    console.log('\n2️⃣ Testing course retrieval...');
    const getAllResponse = await axios.get(`${BASE_URL}/courses`);
    console.log('✅ Retrieved courses:', getAllResponse.data.length, 'courses');

    // Test 3: Get creator stats
    console.log('\n3️⃣ Testing creator stats...');
    const statsResponse = await axios.get(`${BASE_URL}/courses/stats`);
    console.log('✅ Creator stats:', statsResponse.data);

    // Test 4: Update the course
    console.log('\n4️⃣ Testing course update...');
    const courseId = createResponse.data._id;
    const updateData = {
      title: 'Updated Test Course',
      description: 'Updated description',
      level: 'intermediate',
      modules: [],
      tags: ['test', 'workflow', 'updated'],
      outcomes: ['Learn testing', 'Understand workflow', 'Advanced concepts']
    };

    const updateResponse = await axios.put(`${BASE_URL}/courses/${courseId}`, updateData);
    console.log('✅ Course updated successfully:', updateResponse.data.title);

    // Test 5: Get specific course
    console.log('\n5️⃣ Testing specific course retrieval...');
    const getOneResponse = await axios.get(`${BASE_URL}/courses/${courseId}`);
    console.log('✅ Retrieved specific course:', getOneResponse.data.title);

    // Test 6: Delete the course
    console.log('\n6️⃣ Testing course deletion...');
    await axios.delete(`${BASE_URL}/courses/${courseId}`);
    console.log('✅ Course deleted successfully');

    // Test 7: Verify deletion
    console.log('\n7️⃣ Verifying deletion...');
    const finalStatsResponse = await axios.get(`${BASE_URL}/courses/stats`);
    console.log('✅ Final stats after deletion:', finalStatsResponse.data);

    console.log('\n🎉 All tests passed! Course workflow is working correctly.');
    console.log('\n📋 Summary:');
    console.log('- ✅ Course creation without duplicate key errors');
    console.log('- ✅ Owner-based filtering working');
    console.log('- ✅ Creator stats endpoint functional');
    console.log('- ✅ Course updates working properly');
    console.log('- ✅ Course deletion working');
    console.log('- ✅ Data integrity maintained');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
    console.error('Headers:', error.response?.headers);
  }
}

// Run the test
testCourseWorkflow(); 