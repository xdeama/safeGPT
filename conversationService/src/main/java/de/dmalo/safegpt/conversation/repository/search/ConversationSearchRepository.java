package de.dmalo.safegpt.conversation.repository.search;

import co.elastic.clients.elasticsearch._types.query_dsl.QueryStringQuery;
import de.dmalo.safegpt.conversation.domain.Conversation;
import de.dmalo.safegpt.conversation.repository.ConversationRepository;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.client.elc.ElasticsearchTemplate;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.query.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.scheduling.annotation.Async;

/**
 * Spring Data Elasticsearch repository for the {@link Conversation} entity.
 */
public interface ConversationSearchRepository extends ElasticsearchRepository<Conversation, Long>, ConversationSearchRepositoryInternal {}

interface ConversationSearchRepositoryInternal {
    Page<Conversation> search(String query, Pageable pageable);

    Page<Conversation> search(Query query);

    @Async
    void index(Conversation entity);

    @Async
    void deleteFromIndexById(Long id);
}

class ConversationSearchRepositoryInternalImpl implements ConversationSearchRepositoryInternal {

    private final ElasticsearchTemplate elasticsearchTemplate;
    private final ConversationRepository repository;

    ConversationSearchRepositoryInternalImpl(ElasticsearchTemplate elasticsearchTemplate, ConversationRepository repository) {
        this.elasticsearchTemplate = elasticsearchTemplate;
        this.repository = repository;
    }

    @Override
    public Page<Conversation> search(String query, Pageable pageable) {
        NativeQuery nativeQuery = new NativeQuery(QueryStringQuery.of(qs -> qs.query(query))._toQuery());
        return search(nativeQuery.setPageable(pageable));
    }

    @Override
    public Page<Conversation> search(Query query) {
        SearchHits<Conversation> searchHits = elasticsearchTemplate.search(query, Conversation.class);
        List<Conversation> hits = searchHits.map(SearchHit::getContent).stream().toList();
        return new PageImpl<>(hits, query.getPageable(), searchHits.getTotalHits());
    }

    @Override
    public void index(Conversation entity) {
        repository.findById(entity.getId()).ifPresent(elasticsearchTemplate::save);
    }

    @Override
    public void deleteFromIndexById(Long id) {
        elasticsearchTemplate.delete(String.valueOf(id), Conversation.class);
    }
}
