#!/usr/bin/env node

/**
 * Check API Response
 * Simple script to check the current API response
 */

import http from 'http';

const checkAPIResponse = () => {
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/v1/categories/tree',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        console.log('📊 API Response Summary:');
        console.log(`✅ Success: ${response.success}`);
        console.log(`📂 Total Categories: ${response.data?.totalCategories || 'N/A'}`);
        console.log(`🌳 Tree Categories: ${response.data?.tree?.length || 'N/A'}`);
        
        if (response.data?.tree?.length > 0) {
          console.log('\n📁 Main Categories:');
          response.data.tree.forEach((category, index) => {
            console.log(`  ${index + 1}. ${category.name} (${category.categoryType})`);
            if (category.children && category.children.length > 0) {
              console.log(`     └── ${category.children.length} subcategories`);
            }
          });
        }
        
        console.log('\n🎯 Current Status:');
        if (response.data?.totalCategories >= 200) {
          console.log('✅ SUCCESS: You have 200+ categories!');
        } else {
          console.log(`⚠️  You have ${response.data?.totalCategories || 0} categories. Need to add more to reach 200+.`);
        }
        
      } catch (error) {
        console.error('❌ Error parsing response:', error.message);
        console.log('Raw response:', data.substring(0, 500));
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Request failed:', error.message);
    console.log('💡 Make sure the server is running on localhost:3001');
  });

  req.end();
};

checkAPIResponse();
