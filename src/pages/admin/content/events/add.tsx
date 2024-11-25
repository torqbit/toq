import EventForm from "@/components/Events/EventForm";
import AppLayout from "@/components/Layouts/AppLayout";
import { NextPage } from "next";

const EventFormPage: NextPage = () => {
  return (
    <>
      <AppLayout>
        <EventForm />
      </AppLayout>
    </>
  );
};

export default EventFormPage;
