import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Animated, ActivityIndicator, TouchableOpacity } from 'react-native';
import { KineticColors } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

interface SignupFormProps {
  onSignupSuccess?: () => void;
  onSwitchToLogin: () => void;
}

export function SignupForm({ onSignupSuccess, onSwitchToLogin }: SignupFormProps) {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const submitScaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = (anim: Animated.Value) => {
    Animated.spring(anim, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 40,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = (anim: Animated.Value) => {
    Animated.spring(anim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 4,
    }).start();
  };

  const handleSubmit = async () => {
    setErrorMsg('');
    if (!email || !password || !fullName) {
      setErrorMsg('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const { error } = await signUp(email, password, fullName);
      if (error) throw error;
      if (onSignupSuccess) onSignupSuccess();
    } catch (e: any) {
      setErrorMsg(e.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.formSection}>
      {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
      
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor={KineticColors.outline}
        value={fullName}
        onChangeText={setFullName}
        autoCapitalize="words"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Email address"
        placeholderTextColor={KineticColors.outline}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={KineticColors.outline}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Animated.View style={{ transform: [{ scale: submitScaleAnim }], width: '100%', marginTop: 8 }}>
        <Pressable
          onPressIn={() => handlePressIn(submitScaleAnim)}
          onPressOut={() => handlePressOut(submitScaleAnim)}
          onPress={handleSubmit}
          disabled={loading}
          style={({ pressed }) => [
            styles.primaryBtn,
            pressed && styles.primaryBtnPressed,
          ]}
        >
          {loading ? (
            <ActivityIndicator color={KineticColors.onPrimary} />
          ) : (
            <Text style={styles.primaryBtnText}>Create Account</Text>
          )}
        </Pressable>
      </Animated.View>

      <View style={styles.toggleRow}>
        <Text style={styles.toggleText}>Already have an account?</Text>
        <TouchableOpacity onPress={onSwitchToLogin}>
          <Text style={styles.toggleLink}>Log In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formSection: {
    width: '100%',
    paddingHorizontal: 4,
    gap: 12,
  },
  errorText: {
    color: KineticColors.error,
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_500Medium',
    textAlign: 'center',
    marginBottom: 4,
  },
  input: {
    width: '100%',
    height: 54,
    borderRadius: 16,
    backgroundColor: KineticColors.surfaceContainerHigh,
    color: KineticColors.onSurface,
    paddingHorizontal: 20,
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 15,
  },
  primaryBtn: {
    width: '100%',
    height: 56,
    borderRadius: 9999,
    backgroundColor: KineticColors.primaryFixed,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#c9f236',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryBtnPressed: {
    opacity: 0.92,
  },
  primaryBtnText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 16,
    color: KineticColors.onPrimary,
    letterSpacing: -0.2,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  toggleText: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 13,
    color: KineticColors.onSurfaceVariant,
  },
  toggleLink: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 13,
    color: KineticColors.primaryFixed,
  },
});
