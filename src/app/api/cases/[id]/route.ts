// import { NextResponse } from 'next/server';
// import { connectDB } from '@/lib/db';
// import { Case } from '@/lib/models/Case';

// type Props = {
//   params: Promise<{ id: string }>;
// };

// // GET Single Case
// export async function GET(req: Request, { params }: Props) {
//   await connectDB();
//   const { id } = await params;

//   try {
//     const singleCase = await Case.findById(id);
//     if (!singleCase) return NextResponse.json({ error: 'Case not found' }, { status: 404 });
//     return NextResponse.json(singleCase);
//   } catch (error) {
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// }

// // PATCH (Update Move or Dispose)
// export async function PATCH(req: Request, { params }: Props) {
//   await connectDB();
//   const { id } = await params;
//   const body = await req.json();
//   const { action, ...data } = body; 

//   try {
//     const caseItem = await Case.findById(id);
//     if (!caseItem) return NextResponse.json({ error: 'Case not found' }, { status: 404 });

//     if (action === 'ADD_LOG') {
//       caseItem.chainOfCustody.push({
//         from: data.from,
//         to: data.to,
//         purpose: data.purpose,
//         remarks: data.remarks,
//         propertyName: data.propertyName, // <--- SAVING THE SPECIFIC ITEM NAME
//         date: new Date()
//       });
//     } else if (action === 'DISPOSE_PROPERTY') {
//       const propIndex = caseItem.properties.findIndex((p: any) => p._id.toString() === data.propertyId);
//       if (propIndex > -1) {
//         caseItem.properties[propIndex].status = 'Disposed';
//         caseItem.properties[propIndex].disposalDetails = {
//           type: data.disposalType,
//           orderReference: data.orderRef,
//           remarks: data.remarks,
//           date: new Date()
//         };
//       }
      
//       // Auto-close case if all items are disposed
//       const allDisposed = caseItem.properties.every((p: any) => p.status === 'Disposed');
//       if (allDisposed) caseItem.status = 'Disposed';
//     }

//     await caseItem.save();
//     return NextResponse.json(caseItem);
//   } catch (error) {
//     return NextResponse.json({ error: 'Update failed' }, { status: 500 });
//   }
// }

import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Case } from '@/lib/models/Case';

type Props = { params: Promise<{ id: string }> };

export async function GET(req: Request, { params }: Props) {
  await connectDB();
  const { id } = await params;
  try {
    const singleCase = await Case.findById(id);
    if (!singleCase) return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    return NextResponse.json(singleCase);
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: Props) {
  await connectDB();
  const { id } = await params;
  const body = await req.json();
  const { action, ...data } = body; 

  try {
    const caseItem = await Case.findById(id);
    if (!caseItem) return NextResponse.json({ error: 'Case not found' }, { status: 404 });

    // 1. ADD NEW PROPERTY
    if (action === 'ADD_PROPERTY') {
       caseItem.properties.push({
         category: data.category,
         description: data.description,
         quantity: data.quantity,
         location: data.location,
         nature: data.nature,
         belongingTo: data.belongingTo,
         imageUrl: data.imageUrl,
         status: 'In Custody'
       });
       caseItem.status = 'Active'; // Re-open case if it was closed
    }

    // 2. LOG MOVEMENT
    else if (action === 'ADD_LOG') {
      caseItem.chainOfCustody.push({
        from: data.from,
        to: data.to,
        purpose: data.purpose,
        remarks: data.remarks,
        propertyName: data.propertyName,
        date: new Date()
      });
    } 

    // 3. DISPOSE PROPERTY (FIXED LOGIC)
    else if (action === 'DISPOSE_PROPERTY') {
      // Use Mongoose subdocument ID method for accuracy
      const property = caseItem.properties.id(data.propertyId);
      
      if (!property) {
         return NextResponse.json({ error: 'Property not found' }, { status: 404 });
      }

      property.status = 'Disposed';
      property.disposalDetails = {
        type: data.disposalType,
        orderReference: data.orderRef,
        remarks: data.remarks,
        date: new Date()
      };
    }

    // 4. CLOSE CASE
    else if (action === 'CLOSE_CASE') {
       const hasActiveItems = caseItem.properties.some((p: any) => p.status !== 'Disposed');
       if (hasActiveItems) {
          return NextResponse.json({ error: 'Cannot close: Active items remain.' }, { status: 400 });
       }
       caseItem.status = 'Disposed'; 
    }

    await caseItem.save();
    return NextResponse.json(caseItem);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}