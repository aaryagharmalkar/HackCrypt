import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function LoansPage() {
  const [loanAmount, setLoanAmount] = useState(500000);
  const [roi, setRoi] = useState(8.5);
  const [years, setYears] = useState(5);
  const [loanType, setLoanType] = useState("Home Loan");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const monthlyRate = roi / 12 / 100;
  const months = years * 12;

  const emi = useMemo(() => {
    if (monthlyRate === 0) return loanAmount / months;
    return (
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1)
    );
  }, [loanAmount, roi, years]);

  const totalPayment = emi * months;
  const totalInterest = totalPayment - loanAmount;
  const principalPercentage = (loanAmount / totalPayment) * 100;
  const interestPercentage = 100 - principalPercentage;

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="wallet-outline" size={28} color="#059669" />
        <Text style={styles.headerTitle}>Loan Management</Text>
      </View>
      <Text style={styles.subtitle}>
        Calculate EMI and manage your loans effectively
      </Text>

      {/* Calculator Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>EMI Calculator</Text>

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
        <Text style={styles.label}>Loan Amount (₹)</Text>
        <TextInput
          value={String(loanAmount)}
          onChangeText={(v) => setLoanAmount(+v || 0)}
          keyboardType="numeric"
          style={styles.input}
        />
        <Slider
          minimumValue={10000}
          maximumValue={10000000}
          step={10000}
          value={loanAmount}
          onValueChange={setLoanAmount}
          minimumTrackTintColor="#059669"
        />

        {/* Interest */}
        <Text style={styles.label}>Interest Rate (% p.a.)</Text>
        <TextInput
          value={String(roi)}
          onChangeText={(v) => setRoi(+v || 0)}
          keyboardType="numeric"
          style={styles.input}
        />
        <Slider
          minimumValue={1}
          maximumValue={30}
          step={0.1}
          value={roi}
          onValueChange={setRoi}
          minimumTrackTintColor="#059669"
        />

        {/* Start Date */}
        <Text style={styles.label}>Loan Start Date</Text>
        <View style={styles.dateButton} onTouchEnd={() => setShowDatePicker(true)}>
          <Ionicons name="calendar-outline" size={18} />
          <Text style={styles.dateText}>
            {startDate
              ? startDate.toLocaleDateString("en-IN")
              : "Select Date"}
          </Text>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={startDate || new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(_, d) => {
              setShowDatePicker(false);
              if (d) setStartDate(d);
            }}
          />
        )}

        {/* Tenure */}
        <Text style={styles.label}>Tenure: {years} Years</Text>
        <Slider
          minimumValue={1}
          maximumValue={30}
          step={1}
          value={years}
          onValueChange={setYears}
          minimumTrackTintColor="#059669"
        />
      </View>

      {/* EMI Result */}
      <View style={styles.emiCard}>
        <Text style={styles.emiLabel}>Monthly EMI</Text>
        <Text style={styles.emiValue}>
          ₹ {emi.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
        </Text>
        <View style={styles.emiRow}>
          <Text>{months} Months</Text>
          <Text>{roi}% p.a.</Text>
        </View>
      </View>

      {/* Breakdown */}
      <View style={styles.row}>
        <View style={styles.smallCard}>
          <Text style={styles.muted}>Principal</Text>
          <Text style={styles.bold}>
            ₹ {loanAmount.toLocaleString("en-IN")}
          </Text>
          <Text style={styles.green}>
            {principalPercentage.toFixed(1)}%
          </Text>
        </View>

        <View style={styles.smallCard}>
          <Text style={styles.muted}>Interest</Text>
          <Text style={styles.bold}>
            ₹ {totalInterest.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </Text>
          <Text style={styles.orange}>
            {interestPercentage.toFixed(1)}%
          </Text>
        </View>
      </View>

      {/* Total Payment */}
      <View style={styles.card}>
        <Text style={styles.muted}>Total Payment</Text>
        <Text style={styles.big}>
          ₹ {totalPayment.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
        </Text>
        <View style={styles.progressBar}>
          <View style={[styles.progress, { width: `${principalPercentage}%` }]} />
        </View>
      </View>
    </ScrollView>
  );
}

/* ================= Styles ================= */

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F9FAFB" },

  header: { flexDirection: "row", alignItems: "center", gap: 10 },
  headerTitle: { fontSize: 22, fontWeight: "800", color: "#064E3B" },
  subtitle: { color: "#6B7280", marginBottom: 12 },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },

  cardTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },

  label: { fontSize: 13, fontWeight: "600", marginTop: 12 },

  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 10,
    marginTop: 6,
  },

  pickerWrap: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 6,
  },

  dateButton: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    marginTop: 6,
  },

  dateText: { color: "#374151" },

  emiCard: {
    backgroundColor: "#059669",
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
  },

  emiLabel: { color: "#ECFDF5", fontSize: 13 },
  emiValue: { color: "#FFF", fontSize: 34, fontWeight: "800" },
  emiRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },

  row: { flexDirection: "row", gap: 12 },

  smallCard: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 14,
  },

  muted: { color: "#6B7280", fontSize: 12 },
  bold: { fontWeight: "700", fontSize: 16 },
  green: { color: "#059669", fontWeight: "600" },
  orange: { color: "#EA580C", fontWeight: "600" },

  big: { fontSize: 28, fontWeight: "800" },

  progressBar: {
    height: 10,
    backgroundColor: "#E5E7EB",
    borderRadius: 999,
    marginTop: 12,
  },
  progress: {
    height: "100%",
    backgroundColor: "#22C55E",
    borderRadius: 999,
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
