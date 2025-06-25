import { useQuery } from "@tanstack/react-query";

interface AuthData {
  user: {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    breweryId: string;
  };
  brewery: {
    id: string;
    name: string;
    type: string;
    location: string;
  };
}

export const useAuth = () => {
  const { data: authData } = useQuery<AuthData | null>({
    queryKey: ["/api/auth/user"],
  });

  return {
    user: authData?.user,
    brewery: authData?.brewery,
    breweryId: authData?.user?.breweryId,
    isAuthenticated: !!authData?.user,
  };
};