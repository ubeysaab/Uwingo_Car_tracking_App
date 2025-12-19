import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { NormalizedErrorT } from "../../types/auth";

import loginService from "../../api/services/login";
import { useAuthStore } from "../../localStores/authStore";
import { loginCredentialsValidationSchema, loginCredentialsValidationSchemaT } from "../../types/auth";


export default function LoginScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<loginCredentialsValidationSchemaT>({
    mode: "onBlur",
    resolver: zodResolver(loginCredentialsValidationSchema),
    defaultValues: {
      username: "",
      password: "",
    },


  })

  const loginSuccess = useAuthStore(store => store.loginSuccess)
  const onSubmit = async (data: loginCredentialsValidationSchemaT) => {
    try {
      // Simulate API call
      const res = await loginService(
        data.username,
        data.password
      )
      console.log("Login data:", res)
      await loginSuccess(res)

      // Alert.alert("Success", "Logged in successfully!")
    } catch (error: unknown) {
      console.log(error)
      const errorMessage = ((error as NormalizedErrorT).message ||
        " An Error happend Please Try Again Later.")
      Alert.alert(errorMessage)
    }
  }

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <View
                style={styles.logo}
              >
                <Image
                  style={styles.logoImg}
                  source={require("../../../assets/images/logo.png")}
                />
              </View>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Sign in to  Vehicle Tracking System</Text>
            </View>

            {/* Login Form */}
            <View style={styles.form}>

              {/* Username Field */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Username</Text>
                <Controller
                  control={control}
                  name="username"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={[styles.input, errors.username && styles.inputError]}
                      placeholder="Enter your username"
                      placeholderTextColor="#999"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      autoCapitalize="none"
                      autoCorrect={false}
                      editable={!isSubmitting}
                    />
                  )}
                />
                {errors.username && (
                  <Text style={styles.errorText}>{errors.username.message}</Text>
                )}
              </View>

              {/* Password Field */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={[styles.input, errors.password && styles.inputError]}
                      placeholder="Enter your password"
                      placeholderTextColor="#999"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      secureTextEntry
                      editable={!isSubmitting}
                    />
                  )}
                />
                {errors.password && (
                  <Text style={styles.errorText}>{errors.password.message}</Text>
                )}
              </View>

              {/* Additional Options */}
              {/* <View style={styles.optionsContainer}>
                <TouchableOpacity>
                  <Text style={styles.forgotPassword}>Forgot Password?</Text>
                </TouchableOpacity>
              </View> */}

              {/* Alternative Login Button at Bottom */}
              <TouchableOpacity
                style={[styles.bottomLoginButton, isSubmitting && styles.loginButtonDisabled]}
                onPress={handleSubmit(onSubmit)}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Text style={styles.bottomLoginButtonText}>Logging in...</Text>
                ) : (
                  <Text style={styles.bottomLoginButtonText}>Login</Text>
                )}
              </TouchableOpacity>


            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flex: 1,
  },
  logo: {
    width: 200,
    height: 200,
  },
  logoImg: {
    objectFit: 'fill',
    width: '100%',
    height: "100%"
  },
  scrollContent: {
    flexGrow: 1,
    borderColor: "black",
    borderWidth: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  form: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButton: {
    backgroundColor: "#6366f1",
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 32,
    alignItems: "center",
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonDisabled: {
    backgroundColor: "#a5a7f3",
    opacity: 0.8,
  },
  loginButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#1a1a1a",
    backgroundColor: "#fafafa",
  },
  inputError: {
    borderColor: "#ef4444",
    backgroundColor: "#fef2f2",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  optionsContainer: {
    alignItems: "flex-end",
    marginBottom: 24,
  },
  forgotPassword: {
    color: "#6366f1",
    fontSize: 14,
    fontWeight: "500",
  },
  bottomLoginButton: {
    backgroundColor: "#6366f1",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 24,
  },
  bottomLoginButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signupText: {
    color: "#666",
    fontSize: 14,
  },
  signupLink: {
    color: "#6366f1",
    fontSize: 14,
    fontWeight: "600",
  },
})