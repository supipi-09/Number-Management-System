import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
  trend: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  trend,
}) => {
  return (
    <Card
      sx={{
        background: color,
        color: "white",
        borderRadius: 2,
        boxShadow: 3,
        height: "100%",
        "&:hover": { boxShadow: 6, transform: "translateY(-2px)" },
        transition: "all 0.3s ease",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          display="flex"
          alignItems="flex-start"
          justifyContent="space-between"
        >
          <Box>
            <Typography variant="h4" component="h3" fontWeight="bold" mb={1}>
              {value.toLocaleString()}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, mb: 1 }}>
              {title}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              {trend}
            </Typography>
          </Box>
          <Box sx={{ opacity: 0.8 }}>
            <Icon sx={{ fontSize: 48 }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;
