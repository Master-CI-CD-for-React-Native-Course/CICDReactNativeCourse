import {
  Alert,
  Button,
  SafeAreaView,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import Crashes from 'appcenter-crashes';
import Analytics from 'appcenter-analytics';
import { useEffect, useState } from 'react';



function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';


  const checkPreviousSession = async () => {
    const didCrash = await Crashes.hasCrashedInLastSession();
    if (didCrash) {
      const report = await Crashes.lastSessionCrashReport();
      console.log("🚀 ~ file: App.tsx:27 ~ checkPreviousSession ~ report:", report)
      Alert.alert("Sorry about the crash, we're working on a solution");
    }
  }
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    checkPreviousSession();
  }, [])

  return (
    <SafeAreaView style={backgroundStyle}>
      <View style={styles.sectionContainer}>
        <Button title='Calculate Inflation' onPress={() =>
          Analytics.trackEvent('calculate_inflation', { Internet: 'Cellular', GPS: 'On' })} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 82,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
