import { redirect } from "next/navigation";

export default function LoginPage() {
  // Redirect to the Auth Bridge for centralized login
  redirect("https://auth.empiriaindia.com/api/auth/login?returnTo=https://profile.empiriaindia.com/dashboard");
}
