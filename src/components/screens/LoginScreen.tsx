import { NormalizedErrorT } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from 'react-i18next';
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
  View
} from "react-native";

import loginService from "@/api/services/login/login";
import ErrorModal from "@/components/Modals/ErrorModal";
import { useAuthStore } from "@/store/local/authStore";
import { loginCredentialsValidationSchema, loginCredentialsValidationSchemaT } from "@/types/auth";
import { COLORS } from "@/constants";
import Config from "react-native-config";

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



  const checkConfig = () => {
    Alert.alert(
      "Debug Config",
      `URL: ${Config.API_BASE_URL}\nType: ${typeof Config.API_BASE_URL}`
    );
  };
  const { t, i18n } = useTranslation();



  const [errorModalVisibility, setErrorModalVisibility] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')



  function onClose() {
    setErrorModalVisibility(false)
  }

  const loginSuccess = useAuthStore(store => store.loginSuccess)
  const onSubmit = async (data: loginCredentialsValidationSchemaT) => {
    try {
      // Simulate API call
      const res = await loginService(
        data.username,
        data.password
      )
      await loginSuccess(res)

      // Alert.alert("Success", "Logged in successfully!")
    } catch (error: unknown) {
      console.log(error)
      const errMsg = ((error as NormalizedErrorT).message ||
        " An Error happend Please Try Again Later.")
      setErrorMessage(errMsg)
      setErrorModalVisibility(true)
    }
    finally {
      checkConfig()

    }
  }

  return (
    <View style={styles.safeArea}>
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
                  source={require("/assets/images/logo2.png")}
                />
              </View>
              <Text style={styles.title}>{t('loginPage.welcomeBack')}</Text>
              <Text style={styles.subtitle}>{t('loginPage.signIn')}</Text>
            </View>

            {/* Login Form */}
            <View style={styles.form}>

              {/* Username Field */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>{t('loginPage.userName')}</Text>
                <Controller
                  control={control}
                  name="username"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={[styles.input, errors.username && styles.inputError]}
                      placeholder={t('loginPage.placeHolder.userName')}
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
                <Text style={styles.label}>{t('loginPage.password')}</Text>
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={[styles.input, errors.password && styles.inputError]}
                      placeholder={t('loginPage.placeHolder.password')}
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


              <TouchableOpacity
                style={[styles.bottomLoginButton, isSubmitting && styles.loginButtonDisabled]}
                onPress={handleSubmit(onSubmit)}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Text style={styles.bottomLoginButtonText}>{t("loginPage.loggingIn")}</Text>
                ) : (
                  <Text style={styles.bottomLoginButtonText}>{t("loginPage.login")}</Text>
                )}
              </TouchableOpacity>


            </View>

            <ErrorModal
              visible={errorModalVisibility}
              message={errorMessage}
              onClose={onClose}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
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
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
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

  loginButtonDisabled: {
    backgroundColor: COLORS.primaryLight,
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
    color: COLORS.textPrimary,
    // color: "#1a1a1a",
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
    backgroundColor: COLORS.background,
  },
  inputError: {
    borderColor: COLORS.danger,
    backgroundColor: COLORS.background,
  },
  errorText: {
    color: COLORS.danger,
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
    backgroundColor: COLORS.primary,
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
  // signupContainer: {
  //   flexDirection: "row",
  //   justifyContent: "center",
  //   alignItems: "center",
  // },
  // signupText: {
  //   color: "#666",
  //   fontSize: 14,
  // },
  // signupLink: {
  //   color: "#6366f1",
  //   fontSize: 14,
  //   fontWeight: "600",
  // },
})