import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { generateInvoiceJson } from "@/components/DIAN/generateInvoiceJson";
import { InvoiceParams } from "@/components/DIAN/types/InvoiceTypes";

interface TotalSectionProps {
  subtotal: number;
  descuento: number;
  setNextStep: (value: boolean) => void;
}

const TotalSection: React.FC<TotalSectionProps> = ({
  subtotal,
  descuento,
  setNextStep,
}) => {
  const invoiceData: InvoiceParams = {
    resolutionNumber: "18764071164948",
    prefix: "FVP",
    documentNumber: "7",
    operationTypeId: 1,
    typeDocumentId: 7,
    payments: [
      {
        paymentMethodId: 1,
        meansPaymentId: 10,
        valuePaid: "224.00",
      },
    ],
    customer: {
      countryId: "45",
      cityId: "149",
      identityDocumentId: "1",
      typeOrganizationId: 2,
      taxRegimeId: 2,
      taxLevelId: 5,
      companyName: "Santiago Arango",
      dni: "1152440359",
      mobile: "3108435423",
      email: "lws_1234@hotmail.com",
      address: "Direccion residencial",
      postalCode: "661002",
    },
    lines: [
      {
        invoicedQuantity: "2",
        quantityUnitsId: "1093",
        lineExtensionAmount: "100.00",
        freeOfChargeIndicator: false,
        description: "TIJERA NECROPSIA AVES",
        code: "HMT83",
        typeItemIdentificationsId: "4",
        referencePriceId: "1",
        priceAmount: "50",
        baseQuantity: "2",
        um: "M",
        taxTotals: [
          {
            taxId: "1",
            taxAmount: 19,
            taxableAmount: 100,
            percent: 19,
          },
        ],
      },
    ],
    legalMonetaryTotals: {
      lineExtensionAmount: "200.00",
      taxExclusiveAmount: "200.00",
      taxInclusiveAmount: "224.00",
      payableAmount: 224.0,
    },
  };

  const invoiceJson = generateInvoiceJson(invoiceData);

  console.log(invoiceJson, "invoiceJson:::>", invoiceJson);
  return(

    <Box
    id="container total section"
    sx={{
      marginTop: "0.6rem",
    }}
  >
    <Box
      sx={{ width: "100%", display: "flex", justifyContent: "space-between" }}
    >
      <Typography
        sx={{
          color: "#FFF",
          textAlign: "center",
          fontFamily: "Nunito",
          fontSize: { xs: "14px", sm: "16px" },
          fontStyle: "normal",
          fontWeight: 500,
          lineHeight: "140%",
        }}
      >
        Total
      </Typography>
      <Typography
        sx={{
          color: "#FFF",
          textAlign: "center",
          fontFamily: "Nunito",
          fontSize: { xs: "14px", sm: "16px" },
          fontStyle: "normal",
          fontWeight: 500,
          lineHeight: "140%",
        }}
      >
        {`$ ${(subtotal - descuento).toLocaleString("en-US")}`}
      </Typography>
    </Box>

    <Button
      disabled={descuento > subtotal || subtotal === 0}
      onClick={() => setNextStep(true)}
      style={{
        borderRadius: "0.5rem",
        background: descuento > subtotal || subtotal === 0 ? "gray" : "#69EAE2",
        width: "7rem",
        margin: "0 auto",
        display: "flex",
      }}
    >
      <Typography
        sx={{
          color: "#1F1D2B",
          fontFamily: "Nunito",
          fontSize: "0.875rem",
          fontStyle: "normal",
          fontWeight: 600,
          lineHeight: "140%",
        }}
      >
        HECHO
      </Typography>
    </Button>
  </Box>


  )

};

export default TotalSection;
