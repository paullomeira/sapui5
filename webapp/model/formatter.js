sap.ui.define(["sap/ui/core/format/DateFormat", "sap/ui/core/format/NumberFormat"], (DateFormat, NumberFormat) => {
  return {
    /**
     * Formats a date value to a localized date string
     * @param {string|Date} sDate - Date string or Date object
     * @returns {string} Formatted date string
     */
    formatDate: function (sDate) {
      if (!sDate) {
        return "";
      }

      const oDate = typeof sDate === "string" ? new Date(sDate) : sDate;
      if (isNaN(oDate.getTime())) {
        return "";
      }

      const oDateFormat = DateFormat.getDateInstance({
        pattern: "dd/MM/yyyy"
      });

      return oDateFormat.format(oDate);
    },

    /**
     * Formats a date value to a short localized date string
     * @param {string|Date} sDate - Date string or Date object
     * @returns {string} Formatted short date string
     */
    formatDateShort: function (sDate) {
      if (!sDate) {
        return "";
      }

      const oDate = typeof sDate === "string" ? new Date(sDate) : sDate;
      if (isNaN(oDate.getTime())) {
        return "";
      }

      const oDateFormat = DateFormat.getDateInstance({
        style: "short"
      });

      return oDateFormat.format(oDate);
    },

    /**
     * Formats a currency value with Brazilian Real formatting
     * @param {number} fValue - Numeric value to format
     * @returns {string} Formatted currency string
     */
    formatCurrency: function (fValue) {
      if (fValue === null || fValue === undefined || isNaN(fValue)) {
        return "";
      }

      const oCurrencyFormat = NumberFormat.getCurrencyInstance({
        currencyCode: "BRL"
      });

      return oCurrencyFormat.format(fValue, "BRL");
    },

    /**
     * Formats a number value with thousands separator
     * @param {number} fValue - Numeric value to format
     * @returns {string} Formatted number string
     */
    formatNumber: function (fValue) {
      if (fValue === null || fValue === undefined || isNaN(fValue)) {
        return "";
      }

      const oNumberFormat = NumberFormat.getFloatInstance({
        maxFractionDigits: 2,
        groupingEnabled: true
      });

      return oNumberFormat.format(fValue);
    },

    /**
     * Formats employee status with appropriate semantic state
     * @param {string} sStatus - Status value
     * @returns {string} Status text for display
     */
    formatStatus: function (sStatus) {
      if (!sStatus) {
        return "";
      }

      const mStatusMap = {
        Ativo: "Ativo",
        Férias: "Em Férias",
        Licença: "Em Licença",
        Inativo: "Inativo"
      };

      return mStatusMap[sStatus] || sStatus;
    },

    /**
     * Returns the semantic state for employee status
     * @param {string} sStatus - Status value
     * @returns {string} Semantic state (Success, Warning, Information, Error)
     */
    formatStatusState: function (sStatus) {
      if (!sStatus) {
        return "None";
      }

      const mStateMap = {
        Ativo: "Success",
        Férias: "Warning",
        Licença: "Information",
        Inativo: "Error"
      };

      return mStateMap[sStatus] || "None";
    },

    /**
     * Formats first and last name into full name
     * @param {string} sFirstName - First name
     * @param {string} sLastName - Last name
     * @returns {string} Full name
     */
    formatFullName: function (sFirstName, sLastName) {
      if (!sFirstName && !sLastName) {
        return "";
      }

      const aNameParts = [];
      if (sFirstName) {
        aNameParts.push(sFirstName.trim());
      }
      if (sLastName) {
        aNameParts.push(sLastName.trim());
      }

      return aNameParts.join(" ");
    },

    /**
     * Formats name with initials (First Name + Last Name Initial)
     * @param {string} sFirstName - First name
     * @param {string} sLastName - Last name
     * @returns {string} Name with initial
     */
    formatNameWithInitial: function (sFirstName, sLastName) {
      if (!sFirstName) {
        return "";
      }

      let sFormattedName = sFirstName.trim();
      if (sLastName && sLastName.trim().length > 0) {
        sFormattedName += " " + sLastName.trim().charAt(0).toUpperCase() + ".";
      }

      return sFormattedName;
    },

    /**
     * Formats email to display format (lowercase)
     * @param {string} sEmail - Email address
     * @returns {string} Formatted email
     */
    formatEmail: function (sEmail) {
      if (!sEmail) {
        return "";
      }

      return sEmail.toLowerCase().trim();
    },

    /**
     * Formats phone number to Brazilian format
     * @param {string} sPhone - Phone number
     * @returns {string} Formatted phone number
     */
    formatPhone: function (sPhone) {
      if (!sPhone) {
        return "";
      }

      // Remove all non-numeric characters
      const sCleanPhone = sPhone.replace(/\D/g, "");

      // Format based on length
      if (sCleanPhone.length === 11) {
        // Mobile: (XX) 9XXXX-XXXX
        return "(" + sCleanPhone.substr(0, 2) + ") " + sCleanPhone.substr(2, 5) + "-" + sCleanPhone.substr(7, 4);
      } else if (sCleanPhone.length === 10) {
        // Landline: (XX) XXXX-XXXX
        return "(" + sCleanPhone.substr(0, 2) + ") " + sCleanPhone.substr(2, 4) + "-" + sCleanPhone.substr(6, 4);
      }

      // Return original if doesn't match expected patterns
      return sPhone;
    },

    /**
     * Formats department key to display text
     * @param {string} sDepartmentKey - Department key
     * @returns {string} Department display text
     */
    formatDepartment: function (sDepartmentKey) {
      if (!sDepartmentKey) {
        return "";
      }

      const mDepartmentMap = {
        TI: "Tecnologia da Informação",
        RH: "Recursos Humanos",
        FIN: "Financeiro",
        VEN: "Vendas",
        MKT: "Marketing"
      };

      return mDepartmentMap[sDepartmentKey] || sDepartmentKey;
    },

    /**
     * Calculates and formats years of service based on hire date
     * @param {string|Date} sHireDate - Hire date
     * @returns {string} Years of service text
     */
    formatYearsOfService: function (sHireDate) {
      if (!sHireDate) {
        return "";
      }

      const oHireDate = typeof sHireDate === "string" ? new Date(sHireDate) : sHireDate;
      if (isNaN(oHireDate.getTime())) {
        return "";
      }

      const oToday = new Date();
      let iYears = oToday.getFullYear() - oHireDate.getFullYear();
      const iMonths = oToday.getMonth() - oHireDate.getMonth();

      if (iMonths < 0 || (iMonths === 0 && oToday.getDate() < oHireDate.getDate())) {
        iYears--;
      }

      if (iYears === 0) {
        return "Menos de 1 ano";
      } else if (iYears === 1) {
        return "1 ano";
      } else {
        return iYears + " anos";
      }
    },

    /**
     * Formats a percentage value
     * @param {number} fValue - Numeric value (0-1 or 0-100)
     * @param {boolean} bIsDecimal - Whether the value is in decimal format (0-1)
     * @returns {string} Formatted percentage string
     */
    formatPercentage: function (fValue, bIsDecimal) {
      if (fValue === null || fValue === undefined || isNaN(fValue)) {
        return "";
      }

      const oPercentFormat = NumberFormat.getPercentInstance({
        maxFractionDigits: 1
      });

      return oPercentFormat.format(bIsDecimal ? fValue : fValue / 100);
    }
  };
});
