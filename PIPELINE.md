# Pipeline

## Overview

### Taxonomy

The initial list of species relations is first generated and regularly updated using a software data processing pipeline.
Species include vegetables, fruits, herbs, trees, flowers, insects, fungi and animals.

1. First we generate a basic taxonomy of scientific and vernacular names by
    - automatically parsing these wikipedia articles
        - [List of vegetables](https://en.wikipedia.org/wiki/List_of_vegetables)
        - [List of culinary fruits](https://en.wikipedia.org/wiki/List_of_culinary_fruits)
        - [List of companion plants](https://en.wikipedia.org/wiki/List_of_companion_plants)
        - [List of beneficial weeds](https://en.wikipedia.org/wiki/List_of_beneficial_weeds)
        - [List of pest-repelling plants](https://en.wikipedia.org/wiki/List_of_pest-repelling_plants)
    - manually curating taxons that could not be automatically extracted
1. Then we enrich the list with
    - metadata from the free [GBIF API](https://www.gbif.org/developer/species)
        - GBIF identifiers
        - vernacular synonyms in multiple languages
        - However, general taxon data (kingdom, family, genus...) is stored in a sperate JSON file
    - tags from a manually curated list
        - Fruit trees
        - predatory insects
        - beneficial insects
        - pests
        - aromatic plants
        - stone fruits
        - Verticillium-susceptible species


### Relations

1. We use the consolidated taxonomy to extract species relations along with their sources from these wikipedia articles
    - [List of companion plants](https://en.wikipedia.org/wiki/List_of_companion_plants) 
    - [List of beneficial weeds](https://en.wikipedia.org/wiki/List_of_beneficial_weeds) 
    - [List of pest-repelling plants](https://en.wikipedia.org/wiki/List_of_pest-repelling_plants)  
1. We filter out some relations using a manually curated list of exceptions to cleanup the data in the case something went wrong with the automation
1. We then generate the direct relations from the indirect relations to provide a simple entry point to the intercropping dataset


## Updates

### Automatic updates

This Github repository is configured to regularly trigger a [Workflow](https://github.com/adrienj/intercrop-data/actions) to check for sources updates and generate a new dataset when there are new data available. This new dataset is automatically submitted as a [pull request](https://github.com/adrienj/intercrop-data/pulls) and my be merged into the [main branch](https://github.com/adrienj/intercrop-data) by the maintainers.