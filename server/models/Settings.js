import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: 'Eva Curves Fashion Store'
  },
  email: {
    type: String,
    required: true,
    default: 'contact@evacurves.com'
  },
  currency: {
    type: String,
    required: true,
    enum: ['USD', 'ILS', 'EUR'],
    default: 'USD'
  },
  timezone: {
    type: String,
    required: true,
    default: 'UTC-5'
  }
}, {
  timestamps: true
});

// Create default settings if none exist
settingsSchema.statics.createDefaultSettings = async function() {
  try {
    const settings = await this.findOne();
    if (!settings) {
      await this.create({});
      console.log('Default store settings created successfully');
    }
  } catch (error) {
    console.error('Error creating default settings:', error);
  }
};

const Settings = mongoose.model('Settings', settingsSchema);

// Create default settings when the model is initialized
Settings.createDefaultSettings();

export default Settings;