import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "react-feather";
import {
  Button,
  Box,
  Heading,
  FormControl,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  FormHelperText,
  Text,
} from "@chakra-ui/react";
import loginHandler from "./LoginHandler";
import AlertNotif from '../../../components/alert'

export default function LoginForm() {
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);
    const navigate = useNavigate();
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm();
    const submitHandler = async (values) => {
        setIsLoading(true);
        const res = await loginHandler(values);
        setMessage(res.message);
        setStatus(res.status);
        setTimeout(() => {
            if (res.success === true) {
                if (res.data.role === "admin") {
                    navigate("/dashboard/admin/");
                } else if (res.data.role === "manajer") {
                    navigate("/dashboard/manajer/");
                } else {
                    navigate("/dashboard/kasir/");
                }
            }
            setMessage("");
            setStatus("");
            setIsLoading(false);
        }, 1500)
        setIsLoading(false);
    }  
    return (
    <Box width={{ lg: "70%" }} mx={"auto"}>
      <AlertNotification status={status} message={message} />
      <Box mt={4}>
        <Heading fontWeight={600} color="green.600">
          Log In
        </Heading>
        <Text fontSize="md" my={3}>
          Log In to Blast Your Business
        </Text>
      </Box>
      <Box>
        <FormControl method="POST">
          <Input
            type="username"
            name="username"
            id="username"
            borderRadius="full"
            focusBorderColor="green.600"
            placeholder="Username"
            {...register("username", { required: true })}
          />
          {errors.username?.type === "required" && (
            <FormHelperText textColor="red" mb={4}>
              Input username
            </FormHelperText>
          )}
          <InputGroup mt={4}>
            <Input
              type={show ? "text" : "password"}
              name="password"
              id="password"
              borderRadius="full"
              focusBorderColor="green.600"
              placeholder="Password"
              {...register("password", {
                required: true,
                minLength: 8, 
              })} 
            />
            <InputRightElement>
              <IconButton
                borderRadius="full"
                size="sm"
                variant="ghost"
                mr={[2, 6, 10]}
                onClick={handleClick}
                aria-label={"whod hide"}
                icon={show ? <EyeOff /> : <Eye />} 
              />
            </InputRightElement>
          </InputGroup>
          {errors.password?.type === "required" && (
            <FormHelperText textColor="red">Input password</FormHelperText>
          )}
          {errors.password?.type === "minLength" && (
            <FormHelperText textColor="red">
              Password must contain minimal 8 characters
            </FormHelperText>
          )}
          <Button
            mt={8}
            bg="green.600"
            color="white"
            isLoading={isLoading}
            type="submit"
            w="full"
            borderRadius="full"
            borderWidth={2}
            borderColor="green.600"
            _hover={{
              bg: "white",
              color: "green.600",
              borderColor: "green.600",
            }}
            onClick={handleSubmit(async (values) => {
              await submitHandler(values); 
            })}
          >
            Log In
          </Button>
        </FormControl>
      </Box>
    </Box>
    )
}