# Open Intercropping Dataset

## Overview 
[Intercropping](https://www.ontobee.org/ontology/AGRO?iri=http://purl.obolibrary.org/obo/AGRO_00000516) (also known as companion planting), is the planting of different crops in proximity to produce a greater yield. According to a [recent scientometric study](https://www.mdpi.com/2071-1050/13/5/2430/htm), there are around 14,000 publications in the scientific literature in this area of research. Yet there are still no global, centralized and freely available machine-readable dataset of species interactions. Such a dataset would be immensely valuable to the scientific community, the industry and the general public. One of the use cases for this dataset would be to serve as an input for the [garden optimization problem](https://arxiv.org/abs/2101.10827) in machine learning, or to simply help the common hobbyist gardener improve their yield through a simple web application. The aim of this project is to kickstart the collaborative collection and sharing of this data.

## Data guidelines

1. We should prioritize *detailed interactions* (e.g. PlantA provides_nitrogen_to PlantB) over *simple interactions* (e.g. PlantA helps PlantB).
2. We should prioritize *indirect interactions* (e.g. PlantA is_eaten_by InsectA, and PlantB repels InsectA) over *direct interactions* (e.g. PlantA add_nutrients_to_soil_for PlantB). The latter will be flagged for review. 
3. We should prioritize *documented interactions* (e.g. a DOI to a peer-reviews scientific article) over *un-documented interactions* (e.g. a blog post).
 
## Format

To make this dataset future-proof, the first version will be published in the [Resource Description Framework (RDF) format](https://www.w3.org/TR/rdf11-concepts/) and its Ontology in the [Web Ontology Language (OWL) format](https://www.w3.org/TR/owl2-overview/).



## Distribution

For the distribution of the data to a wider audience, we will be using the open [Global Biotic Interactions (GloBI)](https://www.globalbioticinteractions.org/) infrastructure. A data processing pipeline will transform the data in the rdf/nquad or tsv format for GloBI.


## Taxonomy

We need an authoritative, comprehensive and reliable taxonomic reference to standardize the dataset. Candidates are
- [Global Biodiversity Information Facility (GBIF)](https://www.gbif.org/)
- [Encyclopedia of Life (EOL)](https://eol.org/)

## Ontology

Relations between plants should be part of the [Open Biological and Biomedical Ontology (OBO) Relations Ontoloy (RO)](https://obofoundry.org/ontology/ro.html).

However, most of the relationships may not recognized by GloBI (see https://github.com/globalbioticinteractions/globalbioticinteractions/blob/main/eol-globi-lib/src/main/java/org/eol/globi/domain/InteractType.java).


## Roadmap
- Define the ontology
- Define the taxonomic reference
- Document how to contribute
- Parse the wikipedia page (https://en.wikipedia.org/wiki/List_of_companion_plants)
- Contribute to GloBI (https://www.globalbioticinteractions.org/contribute) 
- Publish on zenodo ?
- Update wikidata ?



