import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet } from 'react-native';

export default function TwinklingStar({ style }) {
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 0.3,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ])
    ).start();
  }, []);

  return (
    <Animated.Image
      source={require('../assets/star.png')}
      style={[
        styles.star,
        style,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }
      ]}
    />
  );
}

const styles = StyleSheet.create({
  star: {
    width: 90,
    height: 90,
    position: 'absolute',
  },
});
