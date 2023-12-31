//Auth token we will use to generate a meeting and connect to it
export const authToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiJlNzViNDEzMi1lYTNjLTQ0N2YtYWFhYS1iYzE5ZTI3NmVjNDMiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTcwMzkxNTc1NSwiZXhwIjoxNzA2NTA3NzU1fQ.ALc2v0hARVmjT29rrI6qsRF2Y9gKVpTf-IM_qqi5mUU";

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