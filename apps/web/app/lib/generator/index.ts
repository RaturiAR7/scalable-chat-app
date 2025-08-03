export function generateGuestUser() {
  const randomNum = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
  const id = `guest-${randomNum}-${Date.now()}`; // Ensures uniqueness
  const name = `guest${randomNum}`;
  const email = `guest${randomNum}@example.com`;
  const image = "";

  return {
    id,
    name,
    email,
    image,
  };
}
