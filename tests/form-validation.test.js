/**
 * Census 2027: Digital Enumeration - Form Validation Test Suite
 * Automated Grader Test Coverage & Assertion Stubs
 * 
 * Execution:
 * node tests/form-validation.test.js
 */

const assert = require('assert');

// ==============================================================================
// 1. Validation Logic Under Test (Pure Functions)
// ==============================================================================

const ValidationRules = {
  // Phase 1: Housing & Amenities Validators
  isValidHouseNumber(num) {
    return typeof num === 'string' && num.trim().length >= 2;
  },

  isValidPhoneNumber(phone) {
    const phoneRegex = /^[6-9]\d{9}$/; // Standard 10-digit mobile number starting with 6-9
    return phoneRegex.test(String(phone).trim());
  },

  isValidPinCode(pincode) {
    const pinRegex = /^[1-9]\d{5}$/; // 6-digit postal code not starting with 0
    return pinRegex.test(String(pincode).trim());
  },

  isValidRoomCount(count) {
    const num = Number(count);
    return Number.isInteger(num) && num >= 1 && num <= 50;
  },

  isValidHouseholdSize(size) {
    const num = Number(size);
    return Number.isInteger(num) && num >= 1 && num <= 30;
  },

  isValidWaterSource(source) {
    const validSources = ['treated_tap', 'untreated_tap', 'covered_well', 'handpump', 'spring_river'];
    return validSources.includes(source);
  },

  // Phase 2: Demographics Validators
  isValidName(name) {
    return typeof name === 'string' && name.trim().length >= 2;
  },

  isValidAge(age) {
    const num = Number(age);
    return !isNaN(num) && num >= 0 && num <= 125;
  },

  isValidGender(gender) {
    const validGenders = ['female', 'male', 'transgender'];
    return validGenders.includes(gender);
  },

  isValidEducationLevel(level) {
    const validLevels = [
      'below_primary', 'primary', 'middle', 'matric_secondary',
      'higher_secondary', 'diploma', 'graduate', 'post_graduate'
    ];
    return validLevels.includes(level);
  },

  // Cross-Field Logical Consistency Check
  isDemographicallyConsistent(member) {
    const age = Number(member.age);
    // Consistency Rule 1: A child under 18 cannot hold a Graduate or Post Graduate degree
    if (age < 18 && (member.highestEducation === 'graduate' || member.highestEducation === 'post_graduate')) {
      return false;
    }
    // Consistency Rule 2: A child under 15 cannot be registered as Head of Household
    if (age < 15 && member.relationshipHead === 'head') {
      return false;
    }
    return true;
  }
};

// ==============================================================================
// 2. Test Suite & Runner
// ==============================================================================

let passedTests = 0;
let failedTests = 0;

function runTest(testName, testFn) {
  try {
    testFn();
    console.log(`  ✅ PASS: ${testName}`);
    passedTests++;
  } catch (error) {
    console.error(`  ❌ FAIL: ${testName}`);
    console.error(`     Error: ${error.message}`);
    failedTests++;
  }
}

console.log('================================================================');
console.log('📋 Census 2027: Digital Enumeration - Form Validation Tests');
console.log('================================================================\n');

// --- Test Suite: Phase 1 (Housing & Amenities) ---
console.log('🔹 Testing Phase 1: Housing & Amenities Schedule...');

runTest('Should accept valid municipal house numbers', () => {
  assert.strictEqual(ValidationRules.isValidHouseNumber('BLK-4B/102'), true);
  assert.strictEqual(ValidationRules.isValidHouseNumber('House 24A'), true);
  assert.strictEqual(ValidationRules.isValidHouseNumber(''), false);
  assert.strictEqual(ValidationRules.isValidHouseNumber(' '), false);
});

runTest('Should validate 10-digit mobile phone numbers', () => {
  assert.strictEqual(ValidationRules.isValidPhoneNumber('9876543210'), true);
  assert.strictEqual(ValidationRules.isValidPhoneNumber('8123456789'), true);
  assert.strictEqual(ValidationRules.isValidPhoneNumber('12345'), false); // Too short
  assert.strictEqual(ValidationRules.isValidPhoneNumber('98765432100'), false); // Too long
  assert.strictEqual(ValidationRules.isValidPhoneNumber('abcdefghij'), false); // Non-digit
});

runTest('Should validate 6-digit postal PIN codes', () => {
  assert.strictEqual(ValidationRules.isValidPinCode('110001'), true);
  assert.strictEqual(ValidationRules.isValidPinCode('560001'), true);
  assert.strictEqual(ValidationRules.isValidPinCode('010001'), false); // Cannot start with 0
  assert.strictEqual(ValidationRules.isValidPinCode('11000'), false); // 5 digits
  assert.strictEqual(ValidationRules.isValidPinCode('1100012'), false); // 7 digits
});

runTest('Should validate dwelling room counts (1 to 50)', () => {
  assert.strictEqual(ValidationRules.isValidRoomCount(1), true);
  assert.strictEqual(ValidationRules.isValidRoomCount(4), true);
  assert.strictEqual(ValidationRules.isValidRoomCount(50), true);
  assert.strictEqual(ValidationRules.isValidRoomCount(0), false);
  assert.strictEqual(ValidationRules.isValidRoomCount(51), false);
  assert.strictEqual(ValidationRules.isValidRoomCount(-2), false);
  assert.strictEqual(ValidationRules.isValidRoomCount('abc'), false);
});

runTest('Should validate allowed drinking water sources', () => {
  assert.strictEqual(ValidationRules.isValidWaterSource('treated_tap'), true);
  assert.strictEqual(ValidationRules.isValidWaterSource('handpump'), true);
  assert.strictEqual(ValidationRules.isValidWaterSource('invalid_source'), false);
});

// --- Test Suite: Phase 2 (Demographics & Population) ---
console.log('\n🔹 Testing Phase 2: Population Demographics Schedule...');

runTest('Should validate full legal name', () => {
  assert.strictEqual(ValidationRules.isValidName('Aarav Sharma'), true);
  assert.strictEqual(ValidationRules.isValidName('Dr. Priya Rao'), true);
  assert.strictEqual(ValidationRules.isValidName('A'), false);
  assert.strictEqual(ValidationRules.isValidName(''), false);
});

runTest('Should validate age bounds (0 to 125)', () => {
  assert.strictEqual(ValidationRules.isValidAge(0), true); // Newborn
  assert.strictEqual(ValidationRules.isValidAge(28), true);
  assert.strictEqual(ValidationRules.isValidAge(105), true); // Centenarian
  assert.strictEqual(ValidationRules.isValidAge(-1), false); // Negative
  assert.strictEqual(ValidationRules.isValidAge(130), false); // Exceeds upper threshold
});

runTest('Should validate gender categories', () => {
  assert.strictEqual(ValidationRules.isValidGender('female'), true);
  assert.strictEqual(ValidationRules.isValidGender('male'), true);
  assert.strictEqual(ValidationRules.isValidGender('transgender'), true);
  assert.strictEqual(ValidationRules.isValidGender('unknown_gender'), false);
});

runTest('Should validate highest educational attainment categories', () => {
  assert.strictEqual(ValidationRules.isValidEducationLevel('graduate'), true);
  assert.strictEqual(ValidationRules.isValidEducationLevel('matric_secondary'), true);
  assert.strictEqual(ValidationRules.isValidEducationLevel('post_graduate'), true);
  assert.strictEqual(ValidationRules.isValidEducationLevel('random_degree'), false);
});

runTest('Should detect cross-field demographic anomalies (e.g. 8-year-old with PhD)', () => {
  const validAdult = { age: 32, highestEducation: 'post_graduate', relationshipHead: 'head' };
  const anomalousChild = { age: 8, highestEducation: 'post_graduate', relationshipHead: 'son_daughter' };
  const anomalousChildHead = { age: 10, highestEducation: 'primary', relationshipHead: 'head' };

  assert.strictEqual(ValidationRules.isDemographicallyConsistent(validAdult), true);
  assert.strictEqual(ValidationRules.isDemographicallyConsistent(anomalousChild), false);
  assert.strictEqual(ValidationRules.isDemographicallyConsistent(anomalousChildHead), false);
});

// ==============================================================================
// 3. Test Summary & Results
// ==============================================================================
console.log('\n================================================================');
console.log(`📊 Test Results: ${passedTests} Passed, ${failedTests} Failed.`);
console.log('================================================================');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('🎉 All Census 2027 form validation tests passed successfully!\n');
  process.exit(0);
}
