// import mongoose, { Schema, model, models } from 'mongoose';

// // Define the interface for TypeScript
// export interface ICase {
//   stationName: string;
//   ioName: string;
//   ioId: string; // The badge ID
//   crimeNumber: string;
//   crimeYear: string;
//   firDate: Date;
//   seizureDate: Date;
//   actSection: string;
//   status: 'Active' | 'Disposed';
//   properties: Array<{
//     category: string;
//     description: string;
//     quantity: string;
//     location: string;
//     nature: string;
//     belongingTo: string;
//     qrCodeData?: string;
//     status: 'In Custody' | 'Disposed';
//     disposalDetails?: {
//       type: string;
//       orderReference: string;
//       remarks: string;
//       date: Date;
//     };
//   }>;
//   chainOfCustody: Array<{
//     from: string;
//     to: string;
//     purpose: string;
//     remarks: string;
//     propertyName: string; // <--- NEW FIELD FOR ITEM NAME
//     date: Date;
//   }>;
// }

// const CaseSchema = new Schema<ICase>({
//   stationName: { type: String, required: true },
//   ioName: { type: String, required: true },
//   ioId: { type: String, required: true },
//   crimeNumber: { type: String, required: true },
//   crimeYear: { type: String, required: true },
//   firDate: { type: Date, required: true },
//   seizureDate: { type: Date, required: true },
//   actSection: { type: String, required: true },
//   status: { type: String, default: 'Active' },
//   properties: [{
//     category: String,
//     description: String,
//     quantity: String,
//     location: String,
//     nature: String,
//     belongingTo: String,
//     qrCodeData: String,
//     status: { type: String, default: 'In Custody' },
//     disposalDetails: {
//       type: { type: String },        // Explicitly define type
//       orderReference: { type: String },
//       remarks: { type: String },
//       date: { type: Date }
//     }
//   }],
//   chainOfCustody: [{
//     from: String,
//     to: String,
//     purpose: String,
//     remarks: String,
//     propertyName: String, // <--- SAVING ITEM NAME HERE
//     date: { type: Date, default: Date.now }
//   }]
// }, { timestamps: true });

// export const Case = models.Case || model('Case', CaseSchema);


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
    imageUrl: { type: String },
    status: { type: String, default: 'In Custody' },
    
    // --- FIX START ---
    disposalDetails: {
      // You MUST use this structure when a field is named 'type'
      type: { type: String }, 
      orderReference: { type: String },
      remarks: { type: String },
      date: { type: Date }
    }
    // --- FIX END ---
  }],
  
  chainOfCustody: [{
    from: String,
    to: String,
    purpose: String,
    remarks: String,
    propertyName: String,
    date: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export const Case = models.Case || model('Case', CaseSchema);