"use client";
import { Box, Divider, Typography } from "@mui/material";
import * as React from "react";
import ChartAreaIndex from "@/components/index/ChartAreaIndex";

export default function Home() {
  const arrayFecha = [
    "2024-01-14",
    "2024-01-15",
    "2024-01-16",
    "2024-01-17",
    "2024-01-18",
    "2024-01-19",
    "2024-01-20",
    "2024-01-21"
  ]
  const value = [
    0,
    111000,
    0,
    360500,
    0,
    0,
    292500,
    0
  ]
  const cardsHeader = [
    {
      tile: "Gananacias de hoy",
      count: "$1'725,000",
      percentage: "+55%",
      img: "/dashboard_home/cash.svg"
    },
    {
      tile: "Nuevos Clientes",
      count: "+15",
      percentage: "-14%",
      img: "/dashboard_home/clients.svg"
    },
    {
      tile: "Ventas Totales",
      count: "$3'270,000",
      percentage: "+8%",
      img: "/dashboard_home/rocket.svg"
    },
  ]
  const Container = ({ children }: { children: React.ReactNode }) => {
    return (
      <Box
        sx={{
          borderRadius: "20px",
          background: "linear-gradient(127deg, rgba(6, 11, 38, 0.74) 28.26%, rgba(24, 24, 42, 0.93) 61.61%, #1F1D2B 91.2%)",
          backdropFilter: "blur(60px)",
        }}
      >
        {children}
      </Box>
    );
  };

  return (
    <Box sx={{ width: '98%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {cardsHeader.map((e, i) => {
          return (
            <Box
              key={i * 98}
              width={'31%'}
              sx={{
                padding: '5px 10px',
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
                borderRadius: "20px",
                background: "linear-gradient(127deg, rgba(6, 11, 38, 0.74) 28.26%, #1F1D2B 91.2%)",
                backdropFilter: "blur(60px)",
              }}
            >
              <Box sx={{ width: '60%' }}>
                <Typography
                  sx={{
                    color: "#A0AEC0",
                    fontFamily: "Nunito",
                    fontSize: "18px",
                    fontStyle: "normal",
                    fontWeight: 700,
                    lineHeight: "100%",
                  }}
                >
                  {e.tile}
                </Typography>
                <Box display={'flex'} sx={{ justifyContent: 'space-between' }}>
                  <Typography
                    sx={{
                      color: "#FFF",
                      fontFamily: "Nunito",
                      fontSize: "20px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "140%",
                    }}
                  >
                    {e.count}
                  </Typography>
                  <Typography sx={{ color: e.percentage.includes('+') ? "#01B574" : "#E31A1A" }}>
                    {e.percentage}
                  </Typography>
                </Box>
              </Box>
              <Box>
                <Box component={'img'} src={e.img} />
              </Box>
            </Box>
          )
        })}
      </Box>
      <Divider sx={{ height: '1px', background: '#69EAE2', width: '100%', marginY: '20px' }} />
      <Box display={'flex'} sx={{ justifyContent: 'space-between' }}>
        <Container>
          <Box sx={{ display: 'flex', padding: '15px 40px' }}>
            <Box>
              <Typography
                sx={{
                  color: "#69EAE2",
                  textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                  fontFamily: "Nunito",
                  fontSize: "40px",
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "normal",
                }}
              >
                HOLA CONTAINER !
              </Typography>
              <Typography sx={{
                color: "#69EAE2",
                textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25)",
                fontFamily: "Nunito",
                fontSize: "20px",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "normal",
              }}>
                Nos alegra verte de nuevo.
              </Typography>
            </Box>
            <Box component={'img'} src="/dashboard_home/fox.png" />
          </Box>
        </Container>
        <Container>
          <Box sx={{ padding: '20px', maxHeight: '280px' }}>
            <Box>
              <Typography
                sx={{
                  color: "#69EAE2",
                  textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                  fontFamily: "Nunito",
                  fontSize: "24px",
                  fontStyle: "normal",
                  fontWeight: 500,
                  lineHeight: "140%",
                }}
              >
                Top 10 de productos mas vendidos en Enero
              </Typography>
            </Box>
            <Box sx={{ maxHeight: '180px', overflowY: 'auto' }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((e, i) => {
                return (
                  <Box key={i * 87} display={'flex'} sx={{ height: '50px', justifyContent: "space-between", marginBottom: '8px', marginTop: '10px' }}>
                    <Typography
                      sx={{
                        color: "var(--Gray-Gray-400, #A0AEC0)",
                        fontFamily: "Nunito",
                        fontSize: "20px",
                        fontStyle: "normal",
                        fontWeight: 500,
                        lineHeight: "100%"
                      }}>
                      {i + 1}. cuaderno Barbie X100H
                      <Box>
                        <Typography
                          sx={{
                            color: "var(--Gray-Gray-300, #CBD5E0)",
                            fontFamily: "Nunito",
                            fontSize: "10px",
                            fontStyle: "normal",
                            fontWeight: 400,
                            lineHeight: "150%"
                          }}
                        >
                          30 und  , 400 ventas
                        </Typography>
                      </Box>
                    </Typography>
                    <Box
                      sx={{
                        height: "50px",
                        width: "50px",
                        background: "#fff",
                        textAlignLast: "center",
                        borderRadius: "50%"
                      }}>
                      <Box height={'100%'} component={'img'} src="/dashboard_home/fox.png" />
                    </Box>
                  </Box>
                )
              })}
            </Box>
          </Box>
        </Container>
      </Box>
      <Box sx={{
        marginTop: '20px',
        padding: '20px',
        borderRadius: '20px',
        background: "linear-gradient(127deg, rgba(6, 11, 40, 0.74) 28.26%, rgba(20, 21, 41, 0.88) 54.06%, rgba(28, 27, 43, 0.97) 73.89%, #1F1D2B 91.2%)",
        backdropfilter: "blur(60px)",
        height: '482px'
      }}>
        <Box sx={{ display: 'flex' }}>
          <Box>
            <Typography
              sx={{
                color: "var(--Secondary-Primary-White, #FFF)",
                fontFamily: "Nunito",
                fontSize: "36px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "140%",
              }}>
              Ventas Mensuales
            </Typography>
            <Typography sx={{
              color: "var(--Gray-Gray-400, #A0AEC0)",
              fontFamily: "Nunito",
              fontSize: "20px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "140%",
            }}>
              <span style={{ color: ("+20%").includes("+") ? "green" : 'red' }} >
                (+20%) mas
              </span>  que en Diciembre
            </Typography>
          </Box>
        </Box>
        <Box sx={{
          placeSelf: "center",
          width: "100%",
          textAlignLast: "center",
          marginTop: '-50px'
        }}>
          <Typography
            sx={{
              color: "#69EAE2",
              textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
              fontFamily: "Nunito",
              fontSize: "32px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "normal",
            }}>
            Enero
          </Typography>
        </Box>
        <ChartAreaIndex
          listaFechas={arrayFecha}
          totalVentasPorFecha={value}
        />
      </Box>
    </Box>
  )
}
