import { Box, Card, CardContent, Typography, Grid } from "@mui/material";
import { BoxStyles } from "./styles";

const DashboardCards = ({
  totalVentasHoy,
  totalVentasPendientesHoy,
  totalVentasFecha,
  selectedDate,
  getCurrentDateTime,
}: {
  totalVentasHoy: any;
  totalVentasPendientesHoy: any;
  totalVentasFecha: any;
  selectedDate: any;
  getCurrentDateTime: any;
}) => {
  return (
    <Box sx={{ width: "95%", marginTop: 2 }}>
      <Grid container spacing={2} justifyContent="center">
        {/* Card: Total Ventas Hoy */}
        <Grid item xs={12} sm={6} md={4}>
          <Box width="100%">
            <Card
              sx={{
                ...BoxStyles.boxGreen,
              }}
            >
              <CardContent sx={{ ...BoxStyles.typographyBoxStyles }}>
                <Box sx={{ display: "flex" }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    {"Ventas Hoy:"}
                  </Typography>
                  <Typography
                    sx={{ alignSelf: "center" }}
                    align="center"
                  >{`${getCurrentDateTime()}`}</Typography>
                </Box>
                <Typography variant="h5" sx={{ marginTop: 1 ,fontWeight:900 }}>
                  {`$ ${totalVentasHoy.toLocaleString("en-US")}`}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Grid>

        {/* Card: Total Ventas Pendientes Hoy */}
        <Grid item xs={12} sm={6} md={4}>
          <Box width="100%">
            <Card
              sx={{
                ...BoxStyles.boxGreen,
              }}
            >
              <CardContent sx={{ ...BoxStyles.typographyBoxStyles }}>
                <Box sx={{ display: "flex" }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Pendiente Hoy
                  </Typography>
                  <Typography
                    sx={{ alignSelf: "center" }}
                  >{`Fecha: ${getCurrentDateTime()}`}</Typography>
                </Box>
                <Typography variant="h5" sx={{ marginTop: 1 ,fontWeight:900 }}>
                  {`$ ${totalVentasPendientesHoy.toLocaleString("en-US")}`}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Grid>

        {/* Card: Total Ventas en Fecha Seleccionada */}
        <Grid item xs={12} sm={6} md={4}>
          <Box width="100%">
            <Card
              sx={{
                ...BoxStyles.boxOrange,
              }}
            >
              <CardContent sx={{ ...BoxStyles.typographyBoxStyles }}>
                <Box sx={{ display: "flex" }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Ventas en Fecha
                  </Typography>
                  <Typography
                    sx={{ alignSelf: "center", display: "none" }}
                  >{`Fecha: ${selectedDate ? selectedDate : " "}`}</Typography>
                </Box>
                <Typography variant="h5" sx={{ marginTop: 1 ,fontWeight:900}}>
                  {`$ ${totalVentasFecha.toLocaleString("en-US")}`}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardCards;
