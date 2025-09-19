sap.ui.define(["sapui5/template/model/formatter"], (formatter) => {
  QUnit.module("Formatter Tests");

  QUnit.test("formatDate should format date correctly", (assert) => {
    // Test with string date
    const sResult = formatter.formatDate("2023-01-15");
    assert.equal(sResult, "15/01/2023", "Date string formatted correctly");

    // Test with Date object
    const oDate = new Date(2023, 0, 15); // Month is 0-indexed
    const sResult2 = formatter.formatDate(oDate);
    assert.equal(sResult2, "15/01/2023", "Date object formatted correctly");

    // Test with null/undefined
    assert.equal(formatter.formatDate(null), "", "Null date returns empty string");
    assert.equal(formatter.formatDate(undefined), "", "Undefined date returns empty string");

    // Test with invalid date
    assert.equal(formatter.formatDate("invalid-date"), "", "Invalid date returns empty string");
  });

  QUnit.test("formatCurrency should format currency correctly", (assert) => {
    // Test with valid number
    const sResult = formatter.formatCurrency(1234.56);
    assert.ok(sResult.includes("1.234,56"), "Currency formatted with thousands separator");
    assert.ok(sResult.includes("R$"), "Currency includes BRL symbol");

    // Test with zero
    const sResult2 = formatter.formatCurrency(0);
    assert.ok(sResult2.includes("0,00"), "Zero currency formatted correctly");

    // Test with null/undefined
    assert.equal(formatter.formatCurrency(null), "", "Null currency returns empty string");
    assert.equal(formatter.formatCurrency(undefined), "", "Undefined currency returns empty string");

    // Test with NaN
    assert.equal(formatter.formatCurrency(NaN), "", "NaN currency returns empty string");
  });

  QUnit.test("formatNumber should format numbers correctly", (assert) => {
    // Test with valid number
    const sResult = formatter.formatNumber(1234.56);
    assert.equal(sResult, "1.234,56", "Number formatted with thousands separator");

    // Test with integer
    const sResult2 = formatter.formatNumber(1000);
    assert.equal(sResult2, "1.000,00", "Integer formatted correctly");

    // Test with null/undefined
    assert.equal(formatter.formatNumber(null), "", "Null number returns empty string");
    assert.equal(formatter.formatNumber(undefined), "", "Undefined number returns empty string");
  });

  QUnit.test("formatStatus should format status correctly", (assert) => {
    // Test valid statuses
    assert.equal(formatter.formatStatus("Ativo"), "Ativo", "Active status formatted correctly");
    assert.equal(formatter.formatStatus("Férias"), "Em Férias", "Vacation status formatted correctly");
    assert.equal(formatter.formatStatus("Licença"), "Em Licença", "Leave status formatted correctly");
    assert.equal(formatter.formatStatus("Inativo"), "Inativo", "Inactive status formatted correctly");

    // Test unknown status
    assert.equal(formatter.formatStatus("Unknown"), "Unknown", "Unknown status returns original value");

    // Test null/undefined
    assert.equal(formatter.formatStatus(null), "", "Null status returns empty string");
    assert.equal(formatter.formatStatus(undefined), "", "Undefined status returns empty string");
  });

  QUnit.test("formatStatusState should return correct semantic states", (assert) => {
    // Test valid statuses
    assert.equal(formatter.formatStatusState("Ativo"), "Success", "Active status returns Success state");
    assert.equal(formatter.formatStatusState("Férias"), "Warning", "Vacation status returns Warning state");
    assert.equal(formatter.formatStatusState("Licença"), "Information", "Leave status returns Information state");
    assert.equal(formatter.formatStatusState("Inativo"), "Error", "Inactive status returns Error state");

    // Test unknown status
    assert.equal(formatter.formatStatusState("Unknown"), "None", "Unknown status returns None state");

    // Test null/undefined
    assert.equal(formatter.formatStatusState(null), "None", "Null status returns None state");
  });

  QUnit.test("formatFullName should combine names correctly", (assert) => {
    // Test with both names
    assert.equal(formatter.formatFullName("João", "Silva"), "João Silva", "Full name formatted correctly");

    // Test with only first name
    assert.equal(formatter.formatFullName("João", ""), "João", "Only first name formatted correctly");
    assert.equal(formatter.formatFullName("João", null), "João", "First name with null last name");

    // Test with only last name
    assert.equal(formatter.formatFullName("", "Silva"), "Silva", "Only last name formatted correctly");
    assert.equal(formatter.formatFullName(null, "Silva"), "Silva", "Null first name with last name");

    // Test with both empty/null
    assert.equal(formatter.formatFullName("", ""), "", "Empty names return empty string");
    assert.equal(formatter.formatFullName(null, null), "", "Null names return empty string");

    // Test with whitespace
    assert.equal(formatter.formatFullName("  João  ", "  Silva  "), "João Silva", "Names with whitespace trimmed");
  });

  QUnit.test("formatNameWithInitial should format name with initial correctly", (assert) => {
    // Test with both names
    assert.equal(formatter.formatNameWithInitial("João", "Silva"), "João S.", "Name with initial formatted correctly");

    // Test with only first name
    assert.equal(formatter.formatNameWithInitial("João", ""), "João", "Only first name without initial");
    assert.equal(formatter.formatNameWithInitial("João", null), "João", "First name with null last name");

    // Test with empty first name
    assert.equal(formatter.formatNameWithInitial("", "Silva"), "", "Empty first name returns empty string");
    assert.equal(formatter.formatNameWithInitial(null, "Silva"), "", "Null first name returns empty string");

    // Test with whitespace
    assert.equal(
      formatter.formatNameWithInitial("  João  ", "  silva  "),
      "João S.",
      "Names with whitespace and case handled"
    );
  });

  QUnit.test("formatEmail should format email correctly", (assert) => {
    // Test with mixed case email
    assert.equal(
      formatter.formatEmail("JOAO.SILVA@EMPRESA.COM"),
      "joao.silva@empresa.com",
      "Email converted to lowercase"
    );

    // Test with whitespace
    assert.equal(
      formatter.formatEmail("  joao.silva@empresa.com  "),
      "joao.silva@empresa.com",
      "Email whitespace trimmed"
    );

    // Test with null/undefined
    assert.equal(formatter.formatEmail(null), "", "Null email returns empty string");
    assert.equal(formatter.formatEmail(undefined), "", "Undefined email returns empty string");
  });

  QUnit.test("formatPhone should format phone numbers correctly", (assert) => {
    // Test mobile number (11 digits)
    assert.equal(formatter.formatPhone("11999991234"), "(11) 99999-1234", "Mobile number formatted correctly");
    assert.equal(
      formatter.formatPhone("+55 11 99999-1234"),
      "(11) 99999-1234",
      "Mobile with formatting cleaned and reformatted"
    );

    // Test landline number (10 digits)
    assert.equal(formatter.formatPhone("1133334444"), "(11) 3333-4444", "Landline number formatted correctly");

    // Test invalid length
    assert.equal(formatter.formatPhone("123456"), "123456", "Invalid length returns original");

    // Test null/undefined
    assert.equal(formatter.formatPhone(null), "", "Null phone returns empty string");
    assert.equal(formatter.formatPhone(undefined), "", "Undefined phone returns empty string");
  });

  QUnit.test("formatDepartment should format department keys correctly", (assert) => {
    // Test valid department keys
    assert.equal(formatter.formatDepartment("TI"), "Tecnologia da Informação", "IT department formatted correctly");
    assert.equal(formatter.formatDepartment("RH"), "Recursos Humanos", "HR department formatted correctly");
    assert.equal(formatter.formatDepartment("FIN"), "Financeiro", "Finance department formatted correctly");
    assert.equal(formatter.formatDepartment("VEN"), "Vendas", "Sales department formatted correctly");
    assert.equal(formatter.formatDepartment("MKT"), "Marketing", "Marketing department formatted correctly");

    // Test unknown department
    assert.equal(formatter.formatDepartment("UNKNOWN"), "UNKNOWN", "Unknown department returns original value");

    // Test null/undefined
    assert.equal(formatter.formatDepartment(null), "", "Null department returns empty string");
  });

  QUnit.test("formatYearsOfService should calculate years correctly", (assert) => {
    // Mock current date for consistent testing
    const oOriginalDate = Date;
    const oMockDate = new Date(2023, 11, 15); // December 15, 2023

    // Override Date constructor
    const OriginalDate = window.Date;
    window.Date = function () {
      return oMockDate;
    };
    window.Date.prototype = OriginalDate.prototype;

    // Test with hire date 2 years ago
    const sResult = formatter.formatYearsOfService("2021-12-15");
    assert.equal(sResult, "2 anos", "2 years of service calculated correctly");

    // Test with hire date 1 year ago
    const sResult2 = formatter.formatYearsOfService("2022-12-15");
    assert.equal(sResult2, "1 ano", "1 year of service calculated correctly");

    // Test with recent hire date (less than 1 year)
    const sResult3 = formatter.formatYearsOfService("2023-06-15");
    assert.equal(sResult3, "Menos de 1 ano", "Less than 1 year calculated correctly");

    // Restore original Date
    window.Date = oOriginalDate;

    // Test with null/undefined
    assert.equal(formatter.formatYearsOfService(null), "", "Null hire date returns empty string");
    assert.equal(formatter.formatYearsOfService("invalid-date"), "", "Invalid hire date returns empty string");
  });

  QUnit.test("formatPercentage should format percentages correctly", (assert) => {
    // Test with decimal format (0-1)
    const sResult = formatter.formatPercentage(0.75, true);
    assert.ok(sResult.includes("75"), "Decimal percentage formatted correctly");

    // Test with whole number format (0-100)
    const sResult2 = formatter.formatPercentage(75, false);
    assert.ok(sResult2.includes("75"), "Whole number percentage formatted correctly");

    // Test with null/undefined
    assert.equal(formatter.formatPercentage(null), "", "Null percentage returns empty string");
    assert.equal(formatter.formatPercentage(undefined), "", "Undefined percentage returns empty string");
  });
});
