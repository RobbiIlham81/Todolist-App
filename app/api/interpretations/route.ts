import client from "@/lib/todo_app";
import { Databases, ID, Query } from "appwrite";
import { NextResponse } from "next/server";

const database = new Databases(client);

//Create Interpretations
async function createInterpretations(data: { term: string; interpretations: string }) {
  try {
    const response = await database.createDocument(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string, "Interpretations", ID.unique(), data);
    return response;
  } catch (error) {
    console.log("Error creating interpretations", error);
    throw new Error("Failed to create interpretation");
  }
}

//Fetch Interpretations
async function fetchInterpretations() {
  try {
    const response = await database.listDocuments(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string, "Interpretations", [Query.orderDesc("$createdAt")]);

    return response.documents;
  } catch (error) {
    console.log("Error fetching interpretations", error);
    throw new Error("Failed to fetch interpretation");
  }
}

export async function POST(req: Request) {
  try {
    const { term, interpretation } = await req.json();
    const data = { term, interpretation };
    const response = await createInterpretations(data);
    return NextResponse.json({ message: "Interpretations created" });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to create interpretations",
      },
      { status: 500 }
    );
  }
}
export async function GET() {
  try {
    const interpretations = await fetchInterpretations();
    return NextResponse.json(interpretations);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch interpretations" }, { status: 500 });
  }
}
