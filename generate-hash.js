const bcrypt = require('bcrypt');

async function generateHash() {
  try {
    const password = 'neilu@havelock';
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    console.log('Password:', password);
    console.log('Hash:', hash);
  } catch (error) {
    console.error('Error generating hash:', error);
  }
}

generateHash();
