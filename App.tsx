import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  PanResponder,
  Dimensions, 
  Platform
} from 'react-native';
import UIExamScreen from './screens/UIExamScreen';
import NativeModuleExamScreen from './screens/NativeModuleExamScreen';

const { width } = Dimensions.get('window');

const App = () => {
  const [currentScreen, setCurrentScreen] = React.useState('UI EXAM');
  const drawerWidth = width * 0.75;
  const animatedValue = useRef(new Animated.Value(-drawerWidth)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dx > 0 && gestureState.dx < drawerWidth) {
          animatedValue.setValue(gestureState.dx - drawerWidth);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > drawerWidth / 2) {
          slideDrawerIn();
        } else {
          slideDrawerOut();
        }
      },
    })
  ).current;

  const slideDrawerIn = () => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const slideDrawerOut = () => {
    Animated.timing(animatedValue, {
      toValue: -drawerWidth,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'UI EXAM':
        return <UIExamScreen />;
      case 'NATIVE MODULE EXAM':
        return <NativeModuleExamScreen />;
      default:
        return <UIExamScreen />;
    }
  };

  return (
  <SafeAreaView style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={slideDrawerIn} style={styles.menuButton}>
           <Text style={styles.menuIcon}>≡</Text> 
        </TouchableOpacity>
        <Text style={styles.navBarTitle}>{currentScreen}</Text>
      </View>
      <View style={styles.mainContent}>
        {renderScreen()}
      </View>

      <Animated.View
        style={[
          styles.drawer,
          {
            transform: [{ translateX: animatedValue }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity onPress={() => {
          slideDrawerOut();
          setCurrentScreen('UI EXAM');
        }} style={styles.drawerItem}>
          <Text style={styles.drawerItemText}>UIede EXAM</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          slideDrawerOut();
          setCurrentScreen('NATIVE MODULE EXAM');
        }} style={styles.drawerItem}>
          <Text style={styles.drawerItemText}>NATIVE MODULE EXAM</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  navBar: {
    height: 60,
    backgroundColor: 'black',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  navBarTitle: {
    color: 'white',
    fontSize: 20,
    padding: 5
  },
  menuButton: {
    padding: 5,
  },
  menuIcon: {
    fontSize: 32,
    color: 'white',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawer: {
    paddingTop: Platform.OS === "ios" ? 70 : 10,
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: width * 0.75,
    backgroundColor: '#ddd',
    padding: 10,
  },
  drawerItem: {
    marginBottom: 20,
  },
  drawerItemText: {
    fontSize: 18,
  },
});

export default App;