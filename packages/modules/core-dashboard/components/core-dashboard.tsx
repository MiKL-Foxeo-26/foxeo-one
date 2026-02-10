'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@foxeo/ui'

export function CoreDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Bienvenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Module core-dashboard charge avec succes.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
