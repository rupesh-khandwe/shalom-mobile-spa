//Auth token we will use to generate a meeting and connect to it
export const authToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiJlNzViNDEzMi1lYTNjLTQ0N2YtYWFhYS1iYzE5ZTI3NmVjNDMiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTcwNjgwMTQ3MywiZXhwIjoxODY0NTg5NDczfQ.YxXaiUP4k9iisGdT3QiJTUaZNSRF5b07O5g__EVEJXk";

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