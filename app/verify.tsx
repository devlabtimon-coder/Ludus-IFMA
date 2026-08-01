import VerifyForm from "@/src/components/Verify/VerifyForm";
import VerifyPhoneForm from "@/src/components/Verify/VerifyPhoneForm";
import { useLocalSearchParams } from "expo-router";

export default function Verify() {
  const params = useLocalSearchParams();

  if (params.phone) {
    return <VerifyPhoneForm />;
  }

  return <VerifyForm />;
}
