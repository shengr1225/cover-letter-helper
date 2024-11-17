import { FaMoon } from "react-icons/fa";
import { Flex, Spacer, Icon, Group } from "@chakra-ui/react";
import { useTheme } from "next-themes";

import Logo from "@/app/assets/Logo.svg";
import LinkedInIcon from "@/app/assets/tabler-icon-brand-linkedin.svg";
import MailIcon from "@/app/assets/tabler-icon-mail.svg";
import Image from "next/image";

const OPeachHeader = () => {
  const { theme, setTheme } = useTheme();
  return (
    <Flex
      minWidth="max-content"
      alignItems="center"
      gap="12"
      py="4"
      bg="gray.50"
      px={[4, 4, 12, 48]}
    >
      <Image src={Logo} width={142} alt="logo" />
      <Spacer />
      <Group gap={2} alignItems="center">
        <Icon>
          <FaMoon
            color="light.100"
            cursor="pointer"
            onClick={() => {
              if (theme === "light") {
                setTheme("dark");
              } else {
                setTheme("light");
              }
              console.log(`current theme: ${theme}`);
            }}
          />
        </Icon>

        <Image src={LinkedInIcon} alt="linked icon" width={32} />
        <Image src={MailIcon} alt="mail icon" width={32} />
      </Group>
    </Flex>
  );
};

export default OPeachHeader;
