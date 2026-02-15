import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SelectionProvider } from "@/contexts/SelectionContext";
import { CustomStylesProvider } from "@/contexts/CustomStylesContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import HaircutCatalog from "./pages/HaircutCatalog";
import HaircutDetails from "./pages/HaircutDetails";
import BeardCatalog from "./pages/BeardCatalog";
import BeardDetails from "./pages/BeardDetails";
import Confirmation from "./pages/Confirmation";
import BarberView from "./pages/BarberView";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ResourceList from "./pages/ResourceList";
import NewResource from "./pages/NewResource";
import NewCut from "./pages/NewCut";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
	<QueryClientProvider client={queryClient}>
		<TooltipProvider>
			<AuthProvider>
				<CustomStylesProvider>
					<SelectionProvider>
						<Toaster />
						<Sonner />
						<BrowserRouter>
							<Routes>
								{/* Public Routes */}
								<Route path="/login" element={<Login />} />
								<Route path="/register" element={<Register />} />

								{/* Protected Routes */}
								<Route
									path="/"
									element={
										<ProtectedRoute>
											<Index />
										</ProtectedRoute>
									}
								/>
								<Route
									path="/haircut"
									element={
										<ProtectedRoute>
											<HaircutCatalog />
										</ProtectedRoute>
									}
								/>
								<Route
									path="/haircut/details"
									element={
										<ProtectedRoute>
											<HaircutDetails />
										</ProtectedRoute>
									}
								/>
								<Route
									path="/beard"
									element={
										<ProtectedRoute>
											<BeardCatalog />
										</ProtectedRoute>
									}
								/>
								<Route
									path="/beard/details"
									element={
										<ProtectedRoute>
											<BeardDetails />
										</ProtectedRoute>
									}
								/>
								<Route
									path="/confirmation"
									element={
										<ProtectedRoute>
											<Confirmation />
										</ProtectedRoute>
									}
								/>
								<Route
									path="/barber-view"
									element={
										<ProtectedRoute>
											<BarberView />
										</ProtectedRoute>
									}
								/>

								<Route
									path="/dashboard"
									element={
										<ProtectedRoute>
											<Dashboard />
										</ProtectedRoute>
									}
								/>
								<Route
									path="/dashboard/:resourceKey"
									element={
										<ProtectedRoute>
											<ResourceList />
										</ProtectedRoute>
									}
								/>
								<Route
									path="/dashboard/:resourceKey/novo"
									element={
										<ProtectedRoute>
											<NewResource />
										</ProtectedRoute>
									}
								/>
								<Route
									path="/dashboard/cortes/novo"
									element={
										<ProtectedRoute>
											<NewCut />
										</ProtectedRoute>
									}
								/>

								{/* Catch-all */}
								<Route path="*" element={<NotFound />} />
							</Routes>
						</BrowserRouter>
					</SelectionProvider>
				</CustomStylesProvider>
			</AuthProvider>
		</TooltipProvider>
	</QueryClientProvider>
);

export default App;
