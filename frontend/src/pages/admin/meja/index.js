import { Box, Text } from '@chakra-ui/react'
import React, {useState, useEffect} from 'react'
import HeadingDashboard from '../../../components/text/HeadingDashboard'
import Container from '../../../components/container/Container'
import { getLocalStorage } from '../../../utils/helper/localStorage'
import { LOCAL_STORAGE_USER } from '../../../utils/helper/helper'

export default function index() {
    const [user, setUser] = useState(null)
    useEffect(() => {
        const user = getLocalStorage(LOCAL_STORAGE_USER)
        setUser(user)
    }, [])

    return (
        <Container>
          <Box
            textAlign={"center"}
            display={"flex"}
            flexDir={"column"}
            alignItems={"center"}
            gap={5}
            w={"full"}
            position={"absolute"}
            top={"50%"}
            left={"50%"}
            transform={"translate(-50%, -50%)"}
          >
            <HeadingDashboard text="Welcome to Admin's Dashboard" />
            <Text fontWeight={500} fontSize={"xl"}>
              Hello, {user?.nama_user}
            </Text>
          </Box>
        </Container>
      );
}