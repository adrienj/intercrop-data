# Open Intercropping Dataset

## Overview 
Intercropping (also known as companion planting), is the planting of different crops in proximity to produce a greater yield. According to a [recent scientometric study](https://www.mdpi.com/2071-1050/13/5/2430/htm), there are around 14,000 publications in the scientific literature in this area of research. Yet there are still no global, centralized and freely available machine-readable dataset of species interactions. Such a dataset would be immensely valuable to the scientific community, the industry and the general public. 
The aim of this project is to enable the collaborative collection and sharing of this data.


###### Primary objectives

- [Optimize a garden](https://arxiv.org/abs/2101.10827) using the relations dichotomy (positive/beneficial or negative/detrimental) between species
- Explain each relation impact and usefulness
- Read the source of any relation (DOI, wiki...) to understand the relation and keep track of the research articles digitized by the community
 
## Format

The first version will be published in the [Resource Description Framework (RDF) format](https://www.w3.org/TR/rdf11-concepts/) and its Ontology in the [Web Ontology Language (OWL) format](https://www.w3.org/TR/owl2-overview/). Data processing pipelines may be built in the future to export to other formats.


## Taxonomy

In order to standardize the dataset using an authoritative, comprehensive and reliable taxonomic reference, we'll use the unique taxon identifiers of [Global Biodiversity Information Facility (GBIF)](https://www.gbif.org/).

## Ontology


##### IntercrO : Intercropping Ontology

- Plant, insect/pest, fungus, animal
    - GBIF taxon (e.g. https://www.gbif.org/species/2928997)
- Relations
    - Direct (plant -> relation -> plant)
        - [RO_0002213](http://purl.obolibrary.org/obo/RO_0002213) positively regulates
        *Synonyms: improves/helps/favors/benefits*
            - [RO_0002469](http://purl.obolibrary.org/obo/RO_0002469) provides nutrients for
            *Synonyms: enrich soil for/fertilizes*
            - [AGRO_00000106](http://purl.obolibrary.org/obo/AGRO_00000106) organisms augmentation process
            *attracts beneficial organisms that control pests for*
            - [INTERCRO_001] repels detrimental insects for
            - [INTERCRO_002] retains soil moisture for
        - [RO:0002212](http://purl.obolibrary.org/obo/RO_0002212) negatively regulates
        *Synonyms: impairs/damages/inhibits/detrimental to*
            - [RO_0002457](http://purl.obolibrary.org/obo/RO_0002457) acquires nutrients from
            *Synonyms: deplete nutrients from*
            - [INTERCRO_003] attracts detrimental insects to
            - [INTERCRO_004] repels beneficial insects from
    - Indirect (plant -> relation -> entity -> relation -> plant)
        - Positive 
            - plant -> attracts -> insect -> protects -> plant
            *is indirect of AGRO_00000106*
                - [INTERCRO_005] attracts
                - [INTERCRO_006] protects
            - plant -> repels -> pest -> eats -> plant
            *is indirect of INTERCRO_001*
                - [INTERCRO_007] repels
                - [RO_0002470](http://purl.obolibrary.org/obo/RO_0002470) eats
            - plant -> provides -> nutrient -> needed by -> plant
            *is indirect of RO_0002469*
                - [INTERCRO_008] provides
                - [AGRO_00002062](http://purl.obolibrary.org/obo/AGRO_00002062) any agronomic fertilizer
                - [INTERCRO_009] needed by
                
        - Negative
            - [INTERCRO_010] plant -> attracts -> pest -> eats -> plant
            *is indirect of INTERCRO_003*
                - [INTERCRO_005] attracts
                - [RO_0002470](http://purl.obolibrary.org/obo/RO_0002470) eats
            - [INTERCRO_011] plant -> repels -> insect -> protects -> plant
            *is indirect of INTERCRO_004*
                - [INTERCRO_007] repels
                - [INTERCRO_006] protects

Any indirect relation can be converted to a direct relation.

##### Metadata

Each triple (entity relation entity) must be annotated with a source (doi, wikipedia url, blog url, author ORCID...)


##### Guidelines

1. Prefer **specific** (e.g. provides nutrients for) relations over generic relations (e.g. positively regulates)
1. Prefer **indirect** (e.g. plant -> provides -> nutrient -> needed by -> plant) relations over direct relations (e.g. plant -> provides nutrients for -> plant)
1. Prefer **peer-reviewed scientific publications** sources (with DOI) over other sources

## Distribution

For the distribution of the data to a wider audience, we could be using the open [Global Biotic Interactions (GloBI)](https://www.globalbioticinteractions.org/) infrastructure, and a data processing pipeline would transform the data in the rdf/nquad or tsv format for GloBI. 
However, the GloBI Relations Ontology only accepts the subset of the OBO RO found under ["interacts with"](http://purl.obolibrary.org/obo/RO_0002434).

## Heuristics

- Basic plant metadata
    - plant height
    - root depth
    - bushiness
    - ground cover
    - solar radiation needs
    - soil humidity needs
- Optimization of
    - nutrient in soil (based on root depth)
    - solar radiation (based on plant height, bushiness, ground cover, solar radiation needs)
    - soil humidity (based on ground cover, evaporation)


## Roadmap
- Define the ontology
- Define the taxonomic reference
- Document how to contribute
- Parse the wikipedia page (https://en.wikipedia.org/wiki/List_of_companion_plants)
- Contribute to GloBI (https://www.globalbioticinteractions.org/contribute) ?
- Publish on zenodo ?
- Update wikidata ?



