import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { resourceData } from "@/data/resourceData";
import { DynamicIcon } from "./DynamicIcon";

interface ImageWithFallbackProps {
	imageUrl?: string;
	imageKey?: string;
	iconName: string;
	alt: string;
	containerClassName?: string;
	imageClassName?: string;
	iconClassName?: string;
}

export function ImageWithFallback({
	imageUrl,
	imageKey,
	iconName,
	alt,
	containerClassName,
	imageClassName,
	iconClassName,
}: ImageWithFallbackProps) {
	const [resolvedUrl, setResolvedUrl] = useState<string | undefined>(imageUrl);
	const [loading, setLoading] = useState(false);
	const [imageError, setImageError] = useState(false);

	const shouldResolveSignedUrl = useMemo(
		() => Boolean(imageKey),
		[imageKey],
	);

	useEffect(() => {
		let mounted = true;

		const resolve = async () => {
			setImageError(false);
			setResolvedUrl(imageUrl);

			if (!shouldResolveSignedUrl || !imageKey) {
				return;
			}

			setLoading(true);
			const signedUrl = await resourceData.getPublicImageUrl(imageKey);
			if (mounted) {
				setResolvedUrl(signedUrl || imageUrl);
				setLoading(false);
			}
		};

		resolve();

		return () => {
			mounted = false;
		};
	}, [imageKey, imageUrl, shouldResolveSignedUrl]);

	if (loading && !resolvedUrl) {
		return (
			<div className={cn("w-full h-full flex items-center justify-center", containerClassName)}>
				<Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (resolvedUrl && !imageError) {
		return (
			<div className={cn("w-full h-full", containerClassName)}>
				<img
					src={resolvedUrl}
					alt={alt}
					className={cn("w-full h-full object-cover", imageClassName)}
					onError={() => setImageError(true)}
				/>
			</div>
		);
	}

	return (
		<div className={cn("w-full h-full flex items-center justify-center", containerClassName)}>
			<DynamicIcon
				name={iconName}
				className={cn("h-8 w-8 text-muted-foreground", iconClassName)}
			/>
		</div>
	);
}
