"use server"

import { ID, Query } from "node-appwrite";
import {
  APPOINTMENT_COLLECTION_ID,
  DATABASE_ID,
  databases,
} from "../appwrite.config";
import { parseStringify } from "../utils";
import { Appointment } from "@/types/appwrite.types";

export const createAppointment = async (appointment: CreateAppointmentParams) => {
  try {
    const newAppointment = await databases.createDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      ID.unique(),
      appointment
    );
    console.log("Appointment created successfully:", newAppointment);

    return parseStringify(newAppointment);
  } catch (error) {
    console.error("An error occurred while registering the patient:", error);
  }
};

// GET APPOINTMENT DETAILS
export const getAppointment = async (appointmentId: string) => {
  try {
    const appointment = await databases.getDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId
    );
    return parseStringify(appointment);
  } catch (error) {
    console.log("Error: An error occurred while fetching the appointment:", error);
  }
};

// GET ALL APPOINTMENTS FOR ADMIN STAT CARD
export const getRecentAppointmentsList = async () => {
  try {
    const appointments = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [Query.orderDesc("$createdAt")],
    );
    const initailCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    }

    const counts = (appointments.documents as Appointment[]).reduce((acc, curr) => {
      if (curr.status === "scheduled") {
        acc.scheduledCount += 1;
      } else if (curr.status === "pending") {
        acc.pendingCount += 1;
      } else if (curr.status === "cancelled") {
        acc.cancelledCount += 1;
      }
      return acc;
    }, initailCounts);

    const data = {
      totalCount: appointments.total,
      ...counts,
      documents: appointments.documents,
    }

    return parseStringify(data);
  } catch (error) {
    console.error("An error occurred while fetching recent appointments:", error);
  }
}