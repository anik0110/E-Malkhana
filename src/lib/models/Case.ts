


import mongoose, { Schema, model, models } from 'mongoose';

const CaseSchema = new Schema({
  stationName: { type: String, required: true },
  ioName: { type: String, required: true },
  ioId: { type: String, required: true },
  crimeNumber: { type: String, required: true },
  crimeYear: { type: String, required: true },
  firDate: { type: Date, required: true },
  seizureDate: { type: Date, required: true },
  actSection: { type: String, required: true },
  status: { type: String, default: 'Active' },
  
  properties: [{
    category: String,
    description: String,
    quantity: String,
    location: String,
    nature: String,
    belongingTo: String,
    qrCodeData: String,
    imageUrl: String,
    status: { type: String, default: 'In Custody' },
    disposalDetails: {
      type: { type: String },
      orderReference: { type: String },
      remarks: { type: String },
      date: { type: Date }
    }
  }],
  
  
  chainOfCustody: [{
    from: { type: String },
    to: { type: String },
    purpose: { type: String },
    remarks: { type: String },
    propertyName: { type: String }, 
    date: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export const Case = models.Case || model('Case', CaseSchema);