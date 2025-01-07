import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NativeModuleExamScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>Native Module Exam Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NativeModuleExamScreen;