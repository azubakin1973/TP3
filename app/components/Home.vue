/**
 * Composant Home - Page d'accueil de l'application mobile
 * 
 * Fonctionnalités :
 * - Affichage d'un message d'information générique
 * - Démontre l'utilisation de base des composants NativeScript-Vue
 * - Sert de point de départ ou de modèle pour d'autres composants
 */
<template>
    <Page>
        <ActionBar>
            <Label text="Home"/>
        </ActionBar>

        <GridLayout>
            <Label class="info">
                <FormattedString>
                    <Span class="fas" text.decode="&#xf135; "/>
                    <Span :text="message"/>
                </FormattedString>
            </Label>
        </GridLayout>
    </Page>
</template>

<script>
  export default {
    /**
     * Propriété calculée pour générer un message dynamique
     * @returns {string} Message d'information sur l'application
     */
    computed: {
      message() {
        return "Blank {N}-Vue app"; // Message par défaut indiquant l'état initial de l'application
      }
    }
  };
</script>

<style scoped lang="scss">
    @import '@nativescript/theme/scss/variables/blue';

    // Styles pour l'icône utilisant une police d'icônes
    .fas {
        @include colorize($color: accent);
    }

    // Styles pour le texte informatif
    .info {
        font-size: 20;
        dominant-baseline: center;
        vertical-align: center;
    }
</style>
