import React from "react";

const CreateMeeting = async (id) => {
    //Getting MeetingId from the API we created earlier
   return(
    id == null ? await createMeeting({ token: authToken }) : id
   )
}
export default CreateMeeting;