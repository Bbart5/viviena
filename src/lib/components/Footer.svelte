<script>
	import { asset } from "$app/paths";

</script>
<footer class="bg-white px-6 py-24 md:px-8">
	<div class="mx-auto grid w-full max-w-360 grid-cols-1 gap-12 md:grid-cols-4">
		<!-- Brand -->
		<div class="space-y-6">
			<div class="flex items-center gap-3">
				<img alt="VIVIENA" src="/brand/logo.svg" class="h-8 w-auto" />
			</div>
			<p class="text-sm leading-relaxed text-brand-muted">
				Stowarzyszenie VIVIENA - edukacja, rozwój i praktyczny dostęp do wiedzy dla młodych ludzi,
				ze szczególnym akcentem na edukację finansową.
			</p>
			<a href="mailto:stowarzyszenieviviena@gmail.com" class="block text-sm text-brand-muted"
				>stowarzyszenieviviena@gmail.com</a
			>
			<p class="text-sm text-brand-muted">+48 500 865 201</p>
		</div>

		<!-- Social Media -->
		<div class="flex flex-col gap-4">
			<h5 class="mb-2 text-sm font-bold tracking-widest text-primary uppercase">
				Media społecznościowe
			</h5>
			<a href="https://www.instagram.com/viviena.pl/" target="_blank" rel="noreferrer" class="text-sm text-brand-muted">Instagram</a>
			<a href="https://www.facebook.com/profile.php?id=61572026964494&locale=pl_PL" target="_blank" rel="noreferrer" class="text-sm text-brand-muted">Facebook</a>
			<a href="https://www.linkedin.com/company/stowarzyszenie-viviena" target="_blank" rel="noreferrer" class="text-sm text-brand-muted">LinkedIn</a>
		</div>

		<!-- Registration Data -->
		<div class="flex flex-col gap-4">
			<h5 class="mb-2 text-sm font-bold tracking-widest text-primary uppercase">
				Dane rejestrowe
			</h5>
			<span class="text-sm text-brand-muted">KRS: 0001209507</span>
			<span class="text-sm text-brand-muted">NIP: 7262717174</span>
			<span class="text-sm text-brand-muted">REGON: 543483854</span>
		</div>

		<!-- Location -->
		<div class="flex flex-col gap-4">
			<h5 class="mb-2 text-sm font-bold tracking-widest text-primary uppercase">Siedziba i dokumenty</h5>
			<p class="text-sm text-brand-muted">Adres: ul. Łagiewnicka 80/98 / 152A, 91-456, Łódź</p>
			<a href={asset("/documents/polityka-prywatnosci.html")} class="text-sm text-brand-muted">Polityka prywatności</a>
			<a href={asset("/documents/regulamin-strony.html")} class="text-sm text-brand-muted">Regulamin strony</a>
			<a href={asset("/documents/dane-organizacyjne.html")} class="text-sm text-brand-muted">Dane organizacyjne</a>
		</div>
	</div>

	<!-- Bottom Bar -->
	<div
		class="mx-auto mt-20 flex max-w-360 flex-col items-center justify-between gap-4 border-t border-outline-variant/30 pt-8 sm:flex-row"
	>
		<p class="text-xs text-brand-muted">© Stowarzyszenie VIVIENA</p>
		<div class="flex gap-6">
			<span class="text-xs text-brand-muted">KRS: 0001209507</span>
			<span class="text-xs text-brand-muted">NIP: 7262717174</span>
			<span class="text-xs text-brand-muted">REGON: 543483854</span>
		</div>
	</div>
</footer>
