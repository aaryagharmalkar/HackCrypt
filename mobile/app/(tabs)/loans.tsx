import React, { useState, useMemo } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
} from "react-native";
import Slider from "@react-native-community/slider";
// import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";

/* ---------- HELPERS ---------- */
const formatINR = (num: number) =>
    "₹ " + Math.round(num).toLocaleString("en-IN");

/* ---------- SCREEN ---------- */
export default function EmiCalculatorScreen() {
    const [loanAmount, setLoanAmount] = useState(500000);
    const [roi, setRoi] = useState(8.5);
    const [years, setYears] = useState(5);
    const [loanType, setLoanType] = useState("Home Loan");

    const monthlyRate = roi / 12 / 100;
    const months = years * 12;

    const emi = useMemo(() => {
        if (!loanAmount || !months) return 0;
        if (monthlyRate === 0) return loanAmount / months;

        return (
            loanAmount *
            monthlyRate *
            Math.pow(1 + monthlyRate, months)
        ) / (Math.pow(1 + monthlyRate, months) - 1);
    }, [loanAmount, roi, years]);

    const totalPayment = emi * months;
    const totalInterest = totalPayment - loanAmount;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.card}>
                {/* Header */}
                <View style={styles.header}>
                    <Ionicons name="calculator-outline" size={26} color="#059669" />
                    <Text style={styles.title}>EMI Calculator</Text>
                </View>

                {/* Loan Type */}
<Text style={styles.label}>Loan Type</Text>

<View style={styles.segmented}>
  {["Home", "Personal", "Education", "Car"].map((type) => {
    const active = loanType === type;
    return (
      <Text
        key={type}
        onPress={() => setLoanType(type)}
        style={[
          styles.segment,
          active && styles.segmentActive,
        ]}
      >
        {type}
      </Text>
    );
  })}
</View>



                {/* Loan Amount */}
                <Text style={styles.label}>Loan Amount</Text>
                <View style={styles.inputRow}>
                    <Ionicons name="cash-outline" size={18} color="#6B7280" />
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={loanAmount.toString()}
                        onChangeText={(v) => setLoanAmount(Number(v) || 0)}
                    />
                </View>

                {/* Interest */}
                <Text style={styles.label}>Rate of Interest (% p.a.)</Text>
                <View style={styles.inputRow}>
                    <Ionicons name="trending-up-outline" size={18} color="#6B7280" />
                    <TextInput
                        style={styles.input}
                        keyboardType="decimal-pad"
                        value={roi.toString()}
                        onChangeText={(v) => setRoi(Number(v) || 0)}
                    />
                </View>

                {/* Tenure */}
                <Text style={styles.label}>Tenure: {years} Years</Text>
                <Slider
                    minimumValue={1}
                    maximumValue={30}
                    step={1}
                    value={years}
                    onValueChange={setYears}
                    minimumTrackTintColor="#059669"
                    thumbTintColor="#059669"
                />

                {/* Results */}
                <View style={styles.resultCard}>
                    <Text style={styles.resultTitle}>Loan Summary</Text>

                    <View style={styles.resultMain}>
                        <Text style={styles.resultLabel}>Monthly EMI</Text>
                        <Text style={styles.emi}>{formatINR(emi)}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text>Total Interest</Text>
                        <Text>{formatINR(totalInterest)}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text>Total Payment</Text>
                        <Text>{formatINR(totalPayment)}</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#F3F4F6",
        flexGrow: 1,
        justifyContent: "center",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 18,
        padding: 20,
        elevation: 6,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: "700",
    },
    label: {
        marginTop: 14,
        marginBottom: 6,
        fontSize: 13,
        color: "#374151",
        fontWeight: "600",
    },
    inputRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 12,
        paddingHorizontal: 12,
    },
    input: {
        flex: 1,
        paddingVertical: 10,
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 12,
        overflow: "hidden",
    },
    resultCard: {
        marginTop: 24,
        backgroundColor: "#EEF2FF",
        padding: 16,
        borderRadius: 14,
    },
    resultTitle: {
        fontWeight: "700",
        marginBottom: 10,
    },
    resultMain: {
        alignItems: "center",
        marginBottom: 10,
    },
    resultLabel: {
        fontSize: 13,
        color: "#6B7280",
    },
    emi: {
        fontSize: 26,
        fontWeight: "800",
        color: "#059669",
        marginVertical: 6,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 6,
    },
    segmented: {
  flexDirection: "row",
  backgroundColor: "#F1F5F9",
  borderRadius: 14,
  padding: 4,
},

segment: {
  flex: 1,
  textAlign: "center",
  paddingVertical: 10,
  borderRadius: 12,
  fontWeight: "600",
  color: "#6B7280",
},

segmentActive: {
  backgroundColor: "#059669",
  color: "#fff",
},


});
