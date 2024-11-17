import { Box, Heading, Text, Textarea } from "@chakra-ui/react";

type propType = {
  setAboutJob: React.Dispatch<React.SetStateAction<string>>;
  setAboutCompany: React.Dispatch<React.SetStateAction<string>>;
};

const Step2 = (props: propType) => {
  return (
    <Box>
      <Heading fontSize="xl" mt="10" mb="2" fontWeight="bold">
        Step 2: Enter Job Post
      </Heading>
      <Text mb="2">About the job*</Text>
      <Textarea
        height={128}
        variant="subtle"
        p={3}
        size="sm"
        placeholder="Enter job responsiblities and job qualifications..."
        onChange={(e) => {
          props.setAboutJob(e.currentTarget.value);
        }}
      />
      <Text color="text" mt="4" mb="2">
        About the company*
      </Text>
      <Textarea
        p={3}
        height={128}
        size="sm"
        variant="subtle"
        placeholder="Enter company description"
        onChange={(e) => {
          props.setAboutCompany(e.currentTarget.value);
        }}
      />
    </Box>
  );
};

export default Step2;
