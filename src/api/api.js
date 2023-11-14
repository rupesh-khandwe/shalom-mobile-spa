//Auth token we will use to generate a meeting and connect to it
export const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiI3NDQxNmE3OC1lMTc5LTQ3MjItYjU3OS03N2ZmYmNhNWI0NGIiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTY5OTkyMTYyNCwiZXhwIjoxNzAyNTEzNjI0fQ.jV7T5HGSd0MtBY4wFe_6EB8a5WfB2rXfYXmTsVlbyLs";

// API call to create meeting
export const createMeeting = async ({ token }) => {
  const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
    method: "POST",
    headers: {
      authorization: `${authToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
  //Destructuring the roomId from the response
  const { roomId } = await res.json();
  return roomId;
};