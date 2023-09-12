import React, { useState, useEffect } from 'react';
import Crashes from 'appcenter-crashes';
import Analytics from 'appcenter-analytics';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';

export default function App() {
  const [inflationRate, setInflationRate] = useState(0.0);
  const [riskFreeRate, setRiskFreeRate] = useState(0.0);
  const [amount, setAmount] = useState(0.0);
  const [timeInYears, setTimeInYears] = useState(1);
  const [afterInflation, setAfterInflation] = useState(0.0);
  const [atRiskFree, setAtRiskFree] = useState(0.0);
  const [atRiskFreeAfterInflation, setAtRiskFreeAfterInflation] = useState(0.0);
  const [difference, setDifference] = useState(0);

  const calculateInflationImpact = (value: number, inflationRate: number, time: number) => {
    return value / Math.pow(1 + inflationRate, time);
  };

  const calculate = () => {
    const afterInflation = calculateInflationImpact(amount, inflationRate / 100, timeInYears);
    const atRiskFree = amount * Math.pow(1 + riskFreeRate / 100, timeInYears);
    const atRiskFreeAfterInflation = calculateInflationImpact(atRiskFree, inflationRate / 100, timeInYears);
    const difference = atRiskFreeAfterInflation - afterInflation;

    setAfterInflation(afterInflation);
    setAtRiskFree(atRiskFree);
    setAtRiskFreeAfterInflation(atRiskFreeAfterInflation);
    setDifference(difference);
  };

  const checkPreviousSession = async () => {
    const didCrash = await Crashes.hasCrashedInLastSession();
    if (didCrash) {
      const report = await Crashes.lastSessionCrashReport();
      Alert.alert("Sorry about that crash, we're working on a solution");
    }
  };

  useEffect(() => {
    checkPreviousSession();
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Current inflation rate"
        style={styles.textBox}
        keyboardType="decimal-pad"
        onChangeText={(inflationRate) => setInflationRate(Number(inflationRate))}
      />
      <TextInput
        placeholder="Current risk free rate"
        style={styles.textBox}
        keyboardType="decimal-pad"
        onChangeText={(riskFreeRate) => setRiskFreeRate(Number(riskFreeRate))}
      />
      <TextInput
        placeholder="Amount you want to save"
        style={styles.textBox}
        keyboardType="decimal-pad"
        onChangeText={(amount) => setAmount(Number(amount))}
      />
      <TextInput
        placeholder="For how long (in years) will you save?"
        style={styles.textBox}
        keyboardType="decimal-pad"
        onChangeText={(timeInYears) => setTimeInYears(Number(timeInYears))}
      />
      <Button
        title="Calculate inflation"
        onPress={() => {
          calculate();
          Analytics.trackEvent('calculate_inflation', { Internet: 'WiFi', GPS: 'Off' });
        }}
      />
      <Text style={styles.label}>{timeInYears} years from now you will still have ${amount} but it will only be worth ${afterInflation}.</Text>
      <Text style={styles.label}>But if you invest it at a risk-free rate you will have ${atRiskFree}.</Text>
      <Text style={styles.label}>Which will be worth ${atRiskFreeAfterInflation} after inflation.</Text>
      <Text style={styles.label}>A difference of: ${difference}.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    marginHorizontal: 16,
  },
  label: {
    marginTop: 10,
  },
  textBox: {
    height: 30,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 10,
    padding: 0,
    paddingLeft: 6,
    marginBottom: 6
  },
});