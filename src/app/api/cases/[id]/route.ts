


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

  console.log(`[API] Processing Action: ${action} for Case ${id}`); 

  try {
    const caseItem = await Case.findById(id);
    if (!caseItem) return NextResponse.json({ error: 'Case not found' }, { status: 404 });

    //  ADD NEW PROPERTY
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
       caseItem.status = 'Active';
    }

    //  LOG MOVEMENT (Fixed)
    else if (action === 'ADD_LOG') {
      console.log("[API] Adding Log Data:", data); 
      
      caseItem.chainOfCustody.push({
        from: data.from || 'Malkhana', 
        to: data.to,
        purpose: data.purpose,
        remarks: data.remarks,
        propertyName: data.propertyName, 
        date: new Date()
      });
    } 

    //  DISPOSE PROPERTY
    else if (action === 'DISPOSE_PROPERTY') {
      const property = caseItem.properties.id(data.propertyId);
      if (!property) return NextResponse.json({ error: 'Property not found' }, { status: 404 });

      property.status = 'Disposed';
      property.disposalDetails = {
        type: data.disposalType,
        orderReference: data.orderRef,
        remarks: data.remarks,
        date: new Date()
      };
    }

    //  CLOSE CASE
    else if (action === 'CLOSE_CASE') {
       const hasActiveItems = caseItem.properties.some((p: any) => p.status !== 'Disposed');
       if (hasActiveItems) return NextResponse.json({ error: 'Cannot close: Active items remain.' }, { status: 400 });
       caseItem.status = 'Disposed'; 
    }

    await caseItem.save();
    console.log("[API] Save Successful");
    return NextResponse.json(caseItem);
    
  } catch (error: any) {
    console.error("[API ERROR]", error); 
    return NextResponse.json({ error: error.message || 'Update failed' }, { status: 500 });
  }
}